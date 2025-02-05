import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Events";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const event = await Event.create(data);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function GET() {
    await connectDB();
    const events = await Event.find().populate("user").populate("consultants");
    return NextResponse.json(events);
  }
  