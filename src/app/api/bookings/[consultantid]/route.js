import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // Adjust the path based on your project
import { Booking } from "@/models/Bookings"; // Import Booking model

export async function GET(
	req,
	params 
) {
	try {
		await connectDB();

		const { consultantid } = params;

		// Fetch all bookings for the given event ID
		const bookings = await Booking.find({ consultant: consultantid }).select(
			"startTime endTime"
		);

		return NextResponse.json(bookings, { status: 200 });
	} catch (error) {
		console.error("Error fetching bookings:", error);
		return NextResponse.json(
			{ error: "Failed to fetch bookings" },
			{ status: 500 }
		);
	}
}
