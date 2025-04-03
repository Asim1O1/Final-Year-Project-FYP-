import Hospital from "../../models/hospital.model.js";
import Doctor from "../../models/doctor.model.js";
import User from "../../models/user.model.js";

import createResponse from "../../utils/responseBuilder.js";
import { paginate } from "../../utils/paginationUtil.js";
import { emailTemplates } from "../../utils/emailTemplates.js";
import { sendEmail } from "../../utils/sendEmail.js";

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

export const getUsersForAdmin = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await paginate(User, { role: "user" }, { page, limit });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Users fetched successfully",
        data: result,
      })
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

export const getDoctorsForAdmin = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await paginate(Doctor, {}, { page, limit });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Doctors fetched successfully",
        data: result,
      })
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    next(error);
  }
};
export const handleAccountStatus = async (req, res, next) => {
  try {
    const { accountId, role } = req.params;

    let Model;
    if (role === "doctor") {
      Model = Doctor;
    } else if (role === "user" || role === "hospital_admin") {
      Model = User;
    } else {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid role specified",
        })
      );
    }

    // Fetch the account to check its current status
    const account = await Model.findById(accountId);

    if (!account) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: `${role} not found`,
        })
      );
    }

    // Toggle the isActive status (Activate if currently inactive, Deactivate if active)
    const updatedAccount = await Model.findByIdAndUpdate(
      accountId,
      { isActive: !account.isActive }, // Toggle status
      { new: true }
    );

    // Send appropriate email notification based on activation/deactivation
    const subject = updatedAccount.isActive
      ? emailTemplates.accountActivated.subject
      : emailTemplates.accountDeactivated.subject;

    const template = updatedAccount.isActive
      ? emailTemplates.accountActivated
      : emailTemplates.accountDeactivated;

    const data = {
      fullName: updatedAccount.fullName,
    };

    await sendEmail(updatedAccount.email, subject, template, data);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: `${role} account ${
          updatedAccount.isActive ? "activated" : "deactivated"
        } successfully`,
        data: updatedAccount,
      })
    );
  } catch (error) {
    console.error("Error handling account status:", error);
    next(error);
  }
};
