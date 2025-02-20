import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/Users";

export async function POST(req: NextRequest) {
  try {
    // Extract token from request headers
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify Firebase ID Token
    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) return NextResponse.json({ error: "Invalid Token" }, { status: 403 });

    // Connect to MongoDB
    await connectDB();

    // Check if user exists
    let user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      // Create new user in MongoDB
      user = await User.create({
        name: decodedToken.name || "No Name",
        email: decodedToken.email,
        avatar: decodedToken.picture || "",
      });
    }

    return NextResponse.json({ message: "User saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
