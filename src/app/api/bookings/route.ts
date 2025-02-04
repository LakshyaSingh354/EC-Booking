import { connectDB } from "@/lib/mongodb";
import { sendConfirmationEmail } from "@/lib/nodemailer";
import { Booking } from "@/models/Bookings";
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

    // Ensure no overlapping bookings
    const overlappingBooking = await Booking.findOne({
      event: data.event,
      startTime: { $lt: data.endTime },
      endTime: { $gt: data.startTime },
    });

    if (overlappingBooking) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 400 });
    }

    const booking = await Booking.create(data);

    // Send email confirmation
    const subject = `Booking Confirmation for ${event.title}`;
    const text = `
      Hello ${data.guestName},
      
      Your booking for the event "${event.title}" has been confirmed. Here are the details:
      
      Event: ${event.title}
      Date: ${new Date(data.startTime).toLocaleString()}
      Duration: ${event.duration} minutes
      
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
    const bookings = await Booking.find().populate("event user");
    return NextResponse.json(bookings);
  }
  