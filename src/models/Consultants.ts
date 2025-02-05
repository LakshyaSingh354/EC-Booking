import mongoose, { Schema, Document, model } from "mongoose";

export interface IConsultant extends Document {
  name: string;
  email: string;
  avatar?: string;
  // event: mongoose.Schema.Types.ObjectId;
}

const ConsultantSchema = new Schema<IConsultant>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "default-avatar.jpeg" },
    // event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  },
);

export const Consultant = mongoose.models.Consultant || model<IConsultant>("Consultant", ConsultantSchema);
