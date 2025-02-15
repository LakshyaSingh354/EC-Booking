import mongoose, { Schema, Document, model } from "mongoose";

export interface IConsultant extends Document {
  name: string;
  email: string;
  avatar?: string;
  googleAccessToken: { type: String },
  googleRefreshToken: { type: String },
}

const ConsultantSchema = new Schema<IConsultant>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "default-avatar.jpeg" },
    googleAccessToken: { type: String },
  googleRefreshToken: { type: String },
  },
);

export const Consultant = mongoose.models.Consultant || model<IConsultant>("Consultant", ConsultantSchema);
