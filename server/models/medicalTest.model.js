import mongoose from "mongoose";

const medicalTestSchema = new mongoose.Schema(
    {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
   
      },
      hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
      },
      testName: {
        type: String,
        required: true,
      },
      testDescription: {
        type: String,
        required: true,
      },

      testDate: {
        type: Date,
       
      },
      testPrice:{
        type: Number,
        required: true,
      },
      timeSlot: {
        time: String,  
        isBooked: { type: Boolean, default: true },
      },
      status: {
        type: String,
        enum: ["available","booked", "confirmed", "completed", "cancelled", "report_available"],
        default: "booked",
      },
      payment: {
        method: {
          type: String,
          enum: ["pay_on_site", "pay_now"],
     
        },
        status: {
          type: String,
          enum: ["pending", "paid", "failed"],
          default: "pending",
        },
        transactionId: String,
      },
      report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalReport", 
        default: null,
      },
      testImage: String,
    },
    { timestamps: true }
  );

  const MedicalTest = mongoose.model("MedicalTest", medicalTestSchema);

  export default MedicalTest;