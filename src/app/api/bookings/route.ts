export const dynamic = "force-dynamic";

import { authenticate } from "@/app/middleware/authMiddleware";
import { createGoogleMeet } from "@/lib/googleMeet";
import { connectDB } from "@/lib/mongodb";
import { sendConfirmationEmail } from "@/lib/nodemailer";
import { Booking } from "@/models/Bookings";
import { Consultant } from "@/models/Consultants";
import { Event } from "@/models/Events";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    await connectDB();
    let data = await req.json();
    let userId = "user" in auth ? auth.user._id : null;

    // Check event exists
    const event = await Event.findById(data.event);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Assign consultant
    let consultant = data.consultant
      ? await Consultant.findById(data.consultant)
      : await Consultant.findOne({ _id: { $in: event.consultants } });

    if (!consultant) return NextResponse.json({ error: "Consultant not found" }, { status: 404 });

    // Ensure the consultant has Google OAuth tokens
    if (!consultant.googleAccessToken || !consultant.googleRefreshToken) {
      return NextResponse.json({ error: "Consultant has not linked Google Calendar" }, { status: 414 });
    }

    // Check overlapping bookings
    const overlappingBooking = await Booking.findOne({
      event: data.event,
      consultant: consultant._id,
      startTime: { $lt: data.endTime },
      endTime: { $gt: data.startTime },
    });

    if (overlappingBooking) return NextResponse.json({ error: "Time slot already booked" }, { status: 413 });

    // Create Google Calendar Event and Meet Link
    let meetLink = null;
    try {
      const meetLink = await createGoogleMeet(consultant._id, data.guestEmail);
    } catch (error) {
      console.error("Error creating Google Meet:", error);
    }
    console.log("Meet Link::", meetLink);
    // Create booking
    const bookingData = userId
      ? { ...data, user: userId, consultant: consultant._id, meetLink }
      : { ...data, consultant: consultant._id, meetLink };

    const booking = await Booking.create(bookingData);

    // Send confirmation emails
    const subject = `Booking Confirmation for ${event.title}`;
    const text = `Hello ${data.guestName},

    Your booking for "${event.title}" has been confirmed.

    📅 Date: ${new Date(data.startTime).toLocaleString()}
    ⏳ Duration: ${event.duration} minutes
    👨‍💼 Consultant: ${consultant.name} (${consultant.email})
    📍 Google Meet Link: ${meetLink || "Not available"}

    Thank you for booking with us!

    Best regards,  
    Epitome Consulting`;

    await sendConfirmationEmail(data.guestEmail, subject, text);
    await sendConfirmationEmail(consultant.email, subject, text);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}



export async function GET() {
	await connectDB();
	const bookings = await Booking.find().populate("event user consultant");
	return NextResponse.json(bookings);
}
