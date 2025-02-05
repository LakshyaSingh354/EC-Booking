import { connectDB } from "@/lib/mongodb";
import { Consultant } from "@/models/Consultants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const consultant = await Consultant.create(data);
    return NextResponse.json(consultant, { status: 201 });
  } catch (error) {
    console.error("Error creating consultant:", error);
    return NextResponse.json({ error: "Failed to create consultant" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const consultants = await Consultant.find();
  return NextResponse.json(consultants);
}