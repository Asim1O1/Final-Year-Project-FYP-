import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      default: "pending",
    },
    reason: {
      type: String,
      required: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    // New Fields for Payment
    paymentMethod: {
      type: String,
      enum: ["pay_on_site", "pay_now"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "not_required"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
export default appointmentModel;
