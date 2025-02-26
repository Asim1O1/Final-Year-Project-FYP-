import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["system_admin", "hospital_admin", "user"],
      required: true,
      default: "user",
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid phone number"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordOTPExpiry: {
      type: Date,
      default: null,
    },
    resetPasswordAttempts: {
      type: Number,
      default: 0,
    },
    resetPasswordLockUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
