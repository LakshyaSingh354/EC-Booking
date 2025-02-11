import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/Users";

export async function authenticate(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
  }

  await connectDB();
  let user = await User.findOne({ email: decodedToken.email });

  if (!user) {
    user = await User.create({
      name: decodedToken.name,
      email: decodedToken.email,
      avatar: decodedToken.picture,
    });
  }

  return { user: user, uid: user._id };
}
