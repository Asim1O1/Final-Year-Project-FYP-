import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    specialties: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    hospitalImage: { type: String, required: false },

    medicalTests: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    notifications: [
      {
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    campaigns: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    hospital_admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const hospitalModel = mongoose.model("Hospital", hospitalSchema);

export default hospitalModel;
