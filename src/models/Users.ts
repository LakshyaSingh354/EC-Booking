import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  timeZone?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    timeZone: { type: String, default: "UTC" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || model<IUser>("User", UserSchema);
