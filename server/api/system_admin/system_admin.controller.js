import Hospital from "../../models/hospital.model.js";
import Doctor from "../../models/doctor.model.js";
import User from "../../models/user.model.js";

import createResponse from "../../utils/responseBuilder.js";

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalHospitals = await Hospital.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalHospitalAdmins = await User.countDocuments({
      role: "hospital_admin",
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Dashboard stats fetched successfully",
        data: {
          totalHospitals,
          totalDoctors,
          totalUsers,
          totalHospitalAdmins,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    next(error);
  }
};
