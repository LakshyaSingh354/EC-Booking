import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // Adjust the path based on your project
import { Booking } from "@/models/Bookings"; // Import Booking model

export async function GET(
	req,
	context
) {
	try {
		await connectDB();

		const consultantid = context.params.consultantid;
		// Fetch all bookings for the given event ID
		console.log(consultantid)
		const bookings = await Booking.find({ consultant: consultantid }).select(
			"startTime endTime"
		);
		console.log(bookings);
		return NextResponse.json(bookings, { status: 200 });
	} catch (error) {
		console.error("Error fetching bookings:", error);
		return NextResponse.json(
			{ error: "Failed to fetch bookings" },
			{ status: 500 }
		);
	}
}
