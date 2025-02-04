import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Events";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { eventid: string } }) {
  await connectDB();
  const event = await Event.findById(params.eventid);
  console.log(`Event ID from route.ts::${event}`)
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}
