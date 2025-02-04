import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/Users";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const users = await User.find({});
  return NextResponse.json(users);
}

