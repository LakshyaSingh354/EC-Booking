import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Events";

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID!, // Replace with your Razorpay key ID
	key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay secret key
});

export async function POST(req: Request) {
	try {
		await connectDB();
		const data = await req.json();
		const event = await Event.findById(data.event);

		if (!event) {
			return NextResponse.json(
				{ error: "Event not found" },
				{ status: 404 }
			);
		}

		// Create a Razorpay order
		const order = await razorpay.orders.create({
			amount: event.price * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
			currency: "INR",
			receipt: `order_receipt_${Date.now()}`,
			notes: {
				eventId: event._id,
			},
		});

		if (!order) {
			return NextResponse.json(
				{ error: "Payment order creation failed" },
				{ status: 500 }
			);
		}

		return NextResponse.json(order, { status: 201 });
	} catch (error) {
		console.error("Error creating Razorpay order:", error);
		return NextResponse.json(
			{ error: "Failed to create payment order" },
			{ status: 500 }
		);
	}
}
