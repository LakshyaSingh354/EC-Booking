import { google } from "googleapis";
import { Consultant } from "@/models/Consultants";

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

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return response.data.conferenceData?.entryPoints?.[0]?.uri || null;
  } catch (error: any) {
    console.error("Error creating Google Meet:", error);
    throw error;
  }
}
