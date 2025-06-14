import mongoose from "mongoose";
import appointmentModel from "../../models/appointment.model.js";
import MedicalReport from "../../models/medicalReport.model.js";
import paymentModel from "../../models/payment.model.js";
import TestBooking from "../../models/testBooking.model.js";
import userModel from "../../models/user.model.js";
import { paginate } from "../../utils/paginationUtil.js";
import createResponse from "../../utils/responseBuilder.js";

export const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid user ID format",
        })
      );
    }

    const user = await userModel
      .findById(userId)
      .select(
        "-password -resetPasswordOTP -resetPasswordOTPExpiry -resetPasswordAttempts -resetPasswordLockUntil -__v"
      )
      .populate("hospital")
      .populate({
        path: "appointments",
        populate: { path: "doctor", select: "name specialization" },
      });

    if (!user) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "User retrieved successfully",
        data: user,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Server Error",
      })
    );
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await paginate(
      userModel,
      {},
      {
        page,
        limit,
        populate: [
          { path: "hospital", select: "name location" },
          {
            path: "appointments",
            populate: { path: "doctor", select: "name specialization" },
          },
        ],
        sort: { createdAt: -1 },
      }
    );

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result.data,
        pagination: {
          totalUsers: result.totalCount,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        },
      })
    );
  } catch (error) {
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Server Error",
      })
    );
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const updateData = req.body;

  // Check if the logged-in user is trying to update their own profile
  if (req.user.id !== userId) {
    return res.status(403).json(
      createResponse({
        isSuccess: false,
        statusCode: 403,
        message: "You are not authorized to update this user's profile.",
        error:
          "Unauthorized action: User is trying to update another user's profile.",
      })
    );
  }

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid user ID format",
        })
      );
    }

    // Update user and return the new document
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      })
      .select("-password")
      .populate("hospital")
      .populate({
        path: "appointments",
        populate: { path: "doctor", select: "name specialization" },
      });

    if (!updatedUser) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "User updated successfully",
        data: updatedUser,
      })
    );
  } catch (error) {
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Server Error",
      })
    );
  }
};

export const getUserStats = async (req, res, next) => {
  const { id: userId } = req.params;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid user ID format",
        })
      );
    }

    // Fetch counts from each model
    const [
      appointmentsCount,
      reportsCount,
      testBookingsCount,
      transactionsCount,
    ] = await Promise.all([
      appointmentModel.countDocuments({ user: userId }),
      MedicalReport.countDocuments({ patient: userId }), // Reports
      TestBooking.countDocuments({ userId }), // Test Bookings
      paymentModel.countDocuments({ userId }),
    ]);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "User statistics fetched successfully",
        data: {
          appointmentsCount,
          reportsCount,
          testBookingsCount,
          transactionsCount,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Server Error while fetching user stats",
      })
    );
  }
};
