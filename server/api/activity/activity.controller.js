import Activity from "../../models/activity.model.js";
import createResponse from "../../utils/responseBuilder.js";
import { paginate } from "../../utils/paginationUtil.js";

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
    doctor_approval: {
      title: "Doctor Profile Approved",
      description: `Dr. ${data.fullName} profile verified`,
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
  };

  await Activity.create({
    type,
    title: activityMap[type].title,
    description: activityMap[type].description,
    userId: data.userId,
    doctorId: data.doctorId,
    hospitalId: data.hospitalId,
    performedBy: {
      role: data.role,
      userId: data.userId,
      name: data.nameOfActor,
    },
  });
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await paginate(
      Activity,
      {},
      { page, limit, sort: { createdAt: -1 } }
    );
    console.log("Result of activities", result);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Recent activities fetched successfully",
        data: result,
      })
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    next(error);
  }
};
