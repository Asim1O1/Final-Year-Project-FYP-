import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    testBooking: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestBooking",
      required: true,
    },
    doctorName: {
      type: String,
      required: [true, "Doctor's name is required"],
      trim: true,
    },
    reportTitle: {
      type: String,
      required: true,
    },
    reportFile: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);
export default MedicalReport;