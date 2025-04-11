import mongoose from "mongoose";

const testBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicalTest",
    required: true,
  },
  tokenNumber: {
    type: String,
    default: null,
    index: true,
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "Completed", "cancelled", "booked"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  transactionId: { type: String, default: null },
  notes: {
    type: String,
    default: null,
  },
});

const TestBooking = mongoose.model("TestBooking", testBookingSchema);

export default TestBooking;
