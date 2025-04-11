import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "hospital_registration",
        "new_user",
        "doctor_created",
        "account_status_change",
        "hospital_admin_created",
        "campaign_created",
        "medical_test_created",
      ],
    },
    title: { type: String, required: true },
    description: { type: String, required: true },

    // Role-Based Access Control
    visibleTo: {
      type: [String],
      required: true,
      enum: ["system_admin", "hospital_admin", "doctor", "patient"],
      default: ["system_admin"],
    },

    // Actor Information
    performedBy: {
      role: {
        type: String,
        required: true,
        enum: ["system_admin", "hospital_admin", "doctor", "user"],
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
activitySchema.index({ type: 1 });
activitySchema.index({ "performedBy.userId": 1 });
activitySchema.index({ "targetEntity.id": 1 });
activitySchema.index({ createdAt: -1 }); // Most recent first

const activityModel = mongoose.model("Activity", activitySchema);

export default activityModel;
