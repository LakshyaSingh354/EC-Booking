import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Events";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";

export async function GET(
  request,
  context,
) {
  await connectDB();
  const eventid = context.params.eventid;
  const event = await Event.findById(eventid);
  
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}