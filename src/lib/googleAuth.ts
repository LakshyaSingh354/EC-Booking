import { google } from "googleapis";
import { Consultant } from "@/models/Consultants";
import { connectDB } from "@/lib/mongodb";

export async function refreshGoogleToken(refreshToken: string) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    const { tokens } = await oauth2Client.getToken(refreshToken);

    if (!tokens.access_token) {
      throw new Error("Failed to refresh access token");
    }

    // Update the consultant’s access token in the database
    await connectDB();
    await Consultant.findOneAndUpdate(
      { googleRefreshToken: refreshToken },
      { googleAccessToken: tokens.access_token }
    );

    return tokens.access_token;
  } catch (error) {
    console.error("Error refreshing Google token:", error);
    return null;
  }
}
