import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Mock database (Replace with real database connection logic)
let users: any[] = [];

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  // Check if the user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add new user to the mock database (replace this with DB insert logic)
  const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };
  users.push(newUser);

  // Return success response
  return NextResponse.json({ message: "User registered successfully" });
}