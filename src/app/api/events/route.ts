"use server";

import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Events";
import { NextRequest, NextResponse } from "next/server";
import { Consultant } from "@/models/Consultants";

import mongoose, { ObjectId } from "mongoose";
import { authenticate } from "@/app/middleware/authMiddleware";

export async function POST(req: NextRequest) {
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
    const events = await Event.find().populate("user consultants");
    return NextResponse.json(events);
  }
  