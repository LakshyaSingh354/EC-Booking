import { google } from "googleapis";

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // For service accounts, this might not be used.
);

// Optionally, if you have refresh token logic for consultant accounts, set credentials accordingly.
export default oauth2Client;
