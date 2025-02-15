import { google } from "googleapis";
import { Consultant } from "@/models/Consultants";

async function refreshAccessToken(consultant: any) {
  if (!consultant.googleRefreshToken) {
    throw new Error("Missing Google refresh token. Please reauthorize.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: consultant.googleRefreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Save the new access token
    consultant.googleAccessToken = credentials.access_token;
    await consultant.save();

    return credentials.access_token;
  } catch (error) {
    console.error("Error refreshing Google access token:", error);
    throw new Error("Failed to refresh access token.");
  }
}

export async function createGoogleMeet(consultantId: string, userEmail: string) {
  try {
    const consultant = await Consultant.findById(consultantId);
    if (!consultant || !consultant.googleAccessToken) {
      throw new Error("Consultant not found or missing Google credentials.");
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: consultant.googleAccessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: "Consultation Meeting",
      description: "Scheduled consultation meeting.",
      start: { dateTime: new Date().toISOString(), timeZone: "UTC" },
      end: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
      attendees: [
        { email: userEmail }, // Ensure user email is provided
        { email: consultant.email } // Ensure consultant email is included
      ],
      conferenceData: { createRequest: { requestId: Date.now().toString() } }
    };

    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        conferenceDataVersion: 1,
      });

      return response.data.conferenceData?.entryPoints?.[0]?.uri || null;
    } catch (error: any) {
      if (error.code === 401) {
        console.warn("Access token expired, refreshing...");

        // Refresh the token and retry
        const newAccessToken = await refreshAccessToken(consultant);
        oauth2Client.setCredentials({ access_token: newAccessToken });

        const retryResponse = await calendar.events.insert({
          calendarId: "primary",
          requestBody: event,
          conferenceDataVersion: 1,
        });

        return retryResponse.data.conferenceData?.entryPoints?.[0]?.uri || null;
      }

      throw error;
    }
  } catch (error: any) {
    console.error("Error creating Google Meet:", error);
    throw error;
  }
}
