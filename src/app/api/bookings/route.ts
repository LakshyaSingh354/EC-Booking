import { connectDB } from "@/lib/mongodb";
import { sendConfirmationEmail } from "@/lib/nodemailer";
import { Booking } from "@/models/Bookings";
import { Consultant } from "@/models/Consultants";
import { Event } from "@/models/Events";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Check if event exists
    const event = await Event.findById(data.event);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // If no consultant is provided, randomly assign a consultant
    let consultant;
    if (data.consultant) {
      consultant = await Consultant.findById(data.consultant);
      if (!consultant) {
        return NextResponse.json({ error: "Consultant not found" }, { status: 404 });
      }
      if (!event.consultants.includes(consultant._id)) {
        return NextResponse.json({ error: "Consultant not available for this event" }, { status: 400 });
      }
    } else {
      // Randomly select a consultant from the event's available consultants
      const availableConsultants = await Consultant.find({ _id: { $in: event.consultants } });

      if (availableConsultants.length === 0) {
        return NextResponse.json({ error: "No available consultants for this event" }, { status: 400 });
      }

      // Randomly pick a consultant from the available ones
      consultant = availableConsultants[Math.floor(Math.random() * availableConsultants.length)];
    }

    // Ensure no overlapping bookings
    const overlappingBooking = await Booking.findOne({
      event: data.event,
      consultant: consultant._id,
      startTime: { $lt: data.endTime },
      endTime: { $gt: data.startTime },
    });

    if (overlappingBooking) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 400 });
    }

    // Create the booking
    const booking = await Booking.create({
      ...data,
      consultant: consultant._id, // Ensure the consultant is added to the booking
    });

    // Send email confirmation
    const subject = `Booking Confirmation for ${event.title}`;
    const text = `
      Hello ${data.guestName},
      
      Your booking for the event "${event.title}" has been confirmed. Here are the details:
      
      Event: ${event.title}
      Date: ${new Date(data.startTime).toLocaleString()}
      Duration: ${event.duration} minutes
      Consultant: ${consultant.name}
      Consultant Email: ${consultant.email}
      
      Thank you for using our service!

      Best regards,
      Epitome Consulting
    `;

    await sendConfirmationEmail(data.guestEmail, subject, text);

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
  