import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    // Core Activity Data
    type: {
      type: String,
      required: true,
      enum: [
        "hospital_registration",
        "new_user",
        "doctor_approval",
        "account_status_change",
        "hospital_admin_created",
      ],
    },
    title: { type: String, required: true },
    description: { type: String, required: true },

    // Role-Based Access Control
    visibleTo: {
      type: [String],
      required: true,
      enum: ["system_admin", "hospital_admin", "doctor", "patient"],
      default: ["system_admin"], // Default: only visible to system admins
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
        refPath: "performedBy.role",
      },
      name: String, // Cached for quick display
    },

    // Target Entity (optional)
    targetEntity: {
      type: {
        type: String,
        enum: ["Hospital", "User", "Doctor", "Appointment"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "targetEntity.type",
      },
    },

    // Technical Metadata
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast querying
activitySchema.index({ type: 1 });
activitySchema.index({ "performedBy.userId": 1 });
activitySchema.index({ "targetEntity.id": 1 });
activitySchema.index({ createdAt: -1 }); // Most recent first

const activityModel = mongoose.model("Activity", activitySchema);

export default activityModel;
