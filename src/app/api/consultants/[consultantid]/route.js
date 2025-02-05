import { connectDB } from "@/lib/mongodb";
import { Consultant } from "@/models/Consultants";
import { NextResponse } from "next/server";

export async function GET(
    request,
    context
) {
  await connectDB();
  const consultantid = await context.params.consultantid;
  const consultant = await Consultant.findById(consultantid);
  if(!consultant){
    return NextResponse.json({ error: "Consultant not found" }, { status: 404 });
  }
  return NextResponse.json(consultant);
}