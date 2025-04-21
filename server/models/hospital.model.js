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
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalTest",
      },
    ],

    notifications: [
      {
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],

    hospital_admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

hospitalSchema.index({ name: 1 });
hospitalSchema.index({ location: 1 });
hospitalSchema.index({ specialties: 1 });
hospitalSchema.index({ medicalTests: 1 });

const hospitalModel = mongoose.model("Hospital", hospitalSchema);

export default hospitalModel;
