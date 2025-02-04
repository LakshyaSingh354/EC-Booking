import mongoose, { Schema, Document, model } from "mongoose";

export interface IBooking extends Document {
    event: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    guestEmail: string;
    guestName: string;
    startTime: Date;
    endTime: Date;
  }
  
  const BookingSchema = new Schema<IBooking>(
    {
      event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      guestEmail: { type: String, required: true },
      guestName: { type: String, required: true },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
    },
    { timestamps: true }
  );
  
  export const Booking =
    mongoose.models.Booking || model<IBooking>("Booking", BookingSchema);
  