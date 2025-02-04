import mongoose, { Schema, Document, model } from "mongoose";

export interface IEvent extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  description?: string;
  duration: number; // in minutes
  availability: {
    day: string; // e.g., "Monday"
    startTime: string; // "09:00"
    endTime: string; // "17:00"
  }[];
}

const EventSchema = new Schema<IEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    availability: [
      {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Event =
  mongoose.models.Event || model<IEvent>("Event", EventSchema);
