import Hospital from "../../models/hospital.model.js";
import Doctor from "../../models/doctor.model.js";
import User from "../../models/user.model.js";

import { logActivity } from "../activity/activity.controller.js";

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
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build the base query
    const query = { role: "user" };

    // Add search functionality if search term exists
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        // Add other fields you want to search by
      ];
    }

    const result = await paginate(User, query, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }, // Optional: sort by newest first
    });

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
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { "hospital.name": { $regex: search, $options: "i" } },
      ];
    }

    const result = await paginate(Doctor, query, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: ["hospital"],
    });

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
      console.warn("Invalid role provided:", role);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid role specified",
        })
      );
    }

    const account = await Model.findById(accountId);

    if (!account) {
      console.warn(`${role} not found with ID:`, accountId);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: `${role} not found`,
        })
      );
    }

    // Check if the action is redundant
    if (account.isActive && req.body.action === "activate") {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: `${role} account is already active`,
        })
      );
    }

    if (!account.isActive && req.body.action === "deactivate") {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: `${role} account is already inactive`,
        })
      );
    }

    // Toggle status
    const updatedAccount = await Model.findByIdAndUpdate(
      accountId,
      { isActive: !account.isActive },
      { new: true }
    );

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

    await logActivity("account_status_change", {
      fullName: updatedAccount.fullName,
      isActive: updatedAccount.isActive,
      userId: updatedAccount._id,
      name: updatedAccount.fullName,
      role: "system_admin",
      nameOfActor: req.user?.fullName,
      actorId: req.user?._id,
    });

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
