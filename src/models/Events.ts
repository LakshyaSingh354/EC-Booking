import mongoose, { Schema, Document, model } from "mongoose";

export interface IEvent extends Document {
  user: mongoose.Schema.Types.ObjectId;
  consultants: mongoose.Schema.Types.ObjectId[];
  title: string;
  description?: string;
  duration: number;
  price: number;
}

const EventSchema = new Schema<IEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    consultants: [{ type: Schema.Types.ObjectId, ref: "Consultant", required: true }],
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Event =
  mongoose.models.Event || model<IEvent>("Event", EventSchema);
