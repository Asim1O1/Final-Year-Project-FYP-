import Activity from "../../models/activity.model.js";
import { paginate } from "../../utils/paginationUtil.js";
import createResponse from "../../utils/responseBuilder.js";

export const logActivity = async (type, data) => {
  const activityMap = {
    hospital_registration: {
      title: "New Hospital Registration",
      description: `${data.name} submitted registration`,
    },
    new_user: {
      title: "New User Registration",
      description: `${data.fullName} (${data.email}) created an account`,
    },
    doctor_created: {
      title: "New Doctor Created",
      description: `Dr. ${data.fullName} (${data.email}) was added to the system`,
    },
    account_status_change: {
      title: `Account ${data.isActive ? "Activated" : "Deactivated"}`,
      description: `${data.fullName}'s account was ${
        data.isActive ? "activated" : "deactivated"
      }`,
    },
    hospital_admin_created: {
      title: "Hospital Admin Created",
      description: `${data.fullName} (${data.email}) was assigned as a hospital admin.`,
    },
    medical_test_created: {
      title: "New Medical Test Created",
      description: `${data.testName} ($${data.testPrice}) was added to ${data.hospitalName}`,
    },
    campaign_created: {
      title: "New Campaign Created",
      description: `${data.title} campaign scheduled for ${new Date(
        data.date
      ).toLocaleDateString()} at ${data.location} (${data.hospitalName})`,
    },
  };

  await Activity.create({
    type,
    title: data.title || activityMap[type].title,
    description: data.description || activityMap[type].description,
    userId: data.userId,
    doctorId: data.doctorId,
    hospitalId: data.hospitalId,
    performedBy: {
      role: data.performedBy?.role,
      userId: data.performedBy?.userId,
      name: data.performedBy?.name,
    },
    visibleTo: data.visibleTo,
  });
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user?._id;

    if (!currentUserId) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Unauthorized: User not authenticated",
        })
      );
    }

    // Calculate the date 14 days ago
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const result = await paginate(
      Activity,
      {
        "performedBy.userId": currentUserId,
        createdAt: { $gte: fourteenDaysAgo },
      },
      {
        page,
        limit,
        sort: { createdAt: -1 },
      }
    );

    if (result?.docs?.length > 0) {
      console.log("📝 Sample Activity:", result.docs[0]);
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message:
          "User-specific recent activities (last 14 days) fetched successfully",
        data: result,
      })
    );
  } catch (error) {
    console.error("❌ Error fetching user-specific activities:", error);
    next(error);
  }
};
