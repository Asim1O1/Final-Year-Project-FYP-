import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "doctor",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualifications: [
      {
        degree: { type: String, required: true },
        university: { type: String, required: true },
        graduationYear: { type: Number, required: true },
      },
    ],

    certificationImage: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: String,
      required: true,
    },
    availability: {
      type: [
        {
          day: {
            type: String,
            enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],
      default: [],
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: { type: Boolean, default: true },
    doctorProfileImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);
export default doctorModel;
