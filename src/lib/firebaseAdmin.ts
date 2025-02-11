import admin from "firebase-admin";
import path from "path";


const serviceAccount = path.join(process.cwd(), "ec-booking-e734f-firebase-adminsdk-fbsvc-5f1f0824e8.json");

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

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
