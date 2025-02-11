import admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
}

// Decode the base64 string back to JSON
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyIdToken = async (token: string) => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return null;
  }
};