export const dynamic = "force-dynamic";

import { authenticate } from "@/app/middleware/authMiddleware";
import { connectDB } from "@/lib/mongodb";
import { sendConfirmationEmail } from "@/lib/nodemailer";
import { Booking } from "@/models/Bookings";
import { Consultant } from "@/models/Consultants";
import { Event } from "@/models/Events";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const auth = await authenticate(req);
		if ("error" in auth) {
			return NextResponse.json(
				{ error: "Error in auth" },
				{ status: 401 }
			); // Return a proper Response object
		}
		await connectDB();
		let data = await req.json();
		let userId;
		if ("user" in auth) {
			userId = auth.user._id;
		}

		// Check if event exists
		const event = await Event.findById(data.event);
		if (!event) {
			return NextResponse.json(
				{ error: "Event not found" },
				{ status: 404 }
			);
		}

		// If no consultant is provided, randomly assign a consultant
		let consultant;
		if (data.consultant) {
			consultant = await Consultant.findById(data.consultant);
			if (!consultant) {
				return NextResponse.json(
					{ error: "Consultant not found" },
					{ status: 404 }
				);
			}
			if (!event.consultants.includes(consultant._id)) {
				return NextResponse.json(
					{ error: "Consultant not available for this event" },
					{ status: 400 }
				);
			}
		} else {
			// Randomly select a consultant from the event's available consultants
			const availableConsultants = await Consultant.find({
				_id: { $in: event.consultants },
			});

			if (availableConsultants.length === 0) {
				return NextResponse.json(
					{ error: "No available consultants for this event" },
					{ status: 400 }
				);
			}

			// Randomly pick a consultant from the available ones
			consultant =
				availableConsultants[
					Math.floor(Math.random() * availableConsultants.length)
				];
		}

		// Ensure no overlapping bookings
		const overlappingBooking = await Booking.findOne({
			event: data.event,
			consultant: consultant._id,
			startTime: { $lt: data.endTime },
			endTime: { $gt: data.startTime },
		});

		if (overlappingBooking) {
			return NextResponse.json(
				{ error: "Time slot already booked" },
				{ status: 400 }
			);
		}

		// Create the booking
		console.log("Creating booking:", data);
		if (!data.user) {
			data = {
				...data,
				user: userId, // Ensure the user is added to the booking
				consultant: consultant._id, // Ensure the consultant is added to the booking
			};
		} else {
			data = {
				...data,
				consultant: consultant._id, // Ensure the consultant is added to the booking
			};
		}
		console.log("Creating booking:", data);
		const booking = await Booking.create(data);

		// Send email confirmation
		const subject = `Booking Confirmation for ${event.title}`;
		const text = `Hello ${data.guestName},
      
      Your booking for the event "${
			event.title
		}" has been confirmed. Here are the details:
      
      Event: ${event.title}
      Date: ${new Date(data.startTime).toLocaleString()}
      Duration: ${event.duration} minutes
      Consultant: ${consultant.name}
      Consultant Email: ${consultant.email}
      
      Thank you for using our service!

      Best regards,
      Epitome Consulting`;
		await sendConfirmationEmail(data.guestEmail, subject, text);

		return NextResponse.json(booking, { status: 201 });
	} catch (error) {
		console.error("Error creating booking:", error);
		return NextResponse.json(
			{ error: "Failed to create booking" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	await connectDB();
	const bookings = await Booking.find().populate("event user consultant");
	return NextResponse.json(bookings);
}
