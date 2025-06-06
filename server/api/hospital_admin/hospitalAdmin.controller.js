import bcrypt from "bcryptjs";
import hospitalModel from "../../models/hospital.model.js";
import userModel from "../../models/user.model.js";
import { paginate } from "../../utils/paginationUtil.js";
import createResponse from "../../utils/responseBuilder.js";
import { logActivity } from "../activity/activity.controller.js";

import Appointment from "../../models/appointment.model.js";
import Campaign from "../../models/campaign.model.js";
import Doctor from "../../models/doctor.model.js";
import MedicalTest from "../../models/medicalTest.model.js";
import TestBooking from "../../models/testBooking.model.js";

export const createHospitalAdmin = async (req, res, next) => {
  try {
    const { fullName, email, password, gender, phone, hospitalId, address } =
      req.body;
    console.log("The request body is", req.body);

    const existingUser = await userModel.findOne({
      $or: [{ email }],
    });
    if (existingUser) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "User with this email already exists",
          error: null,
        })
      );
    }

    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found",
          error: null,
        })
      );
    }

    // ✅ Check if hospital already has an admin
    if (hospital.hospital_admin) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "This hospital already has an assigned hospital admin",
          error: null,
        })
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the hospital admin user
    const hospitalAdmin = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      gender,
      phone,
      address,
      role: "hospital_admin",
      hospital: hospitalId,
    });

    // Assign the hospital admin to the hospital
    hospital.hospital_admin = hospitalAdmin._id;
    await hospital.save();

    await logActivity("hospital_admin_created", {
      title: `Hospital Admin Created: ${hospitalAdmin.fullName}`,
      description: `${hospitalAdmin.fullName} (email: ${hospitalAdmin.email}) was assigned as a hospital admin.`,
      performedBy: {
        role: req.user?.role || "system_admin",
        userId: req.user?._id,
        name: req.user?.fullName,
      },
    });

    const { password: _, ...hospitalAdminData } = hospitalAdmin.toObject();

    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Hospital admin created successfully",
        data: hospitalAdminData,
      })
    );
  } catch (error) {
    console.error("Create Hospital Admin Error:", error.message);
    next(error);
  }
};

export const updateHospitalAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("🔧 [Update Hospital Admin]");
    console.log("➡️ Admin ID:", id);
    console.log("📝 Incoming Update Data:", updateData);

    if (updateData.password) {
      console.log("🔐 Hashing new password...");
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedAdmin = await userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedAdmin) {
      console.warn("⚠️ No admin found with that ID.");
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital admin not found",
          error: null,
        })
      );
    }

    console.log("✅ Admin updated successfully:", updatedAdmin);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital admin updated successfully",
        data: updatedAdmin,
      })
    );
  } catch (error) {
    console.error("❌ Update Hospital Admin Error:", error.message);
    next(error);
  }
};

export const deleteHospitalAdmin = async (req, res, next) => {
  try {
    console.log("Entered the delete hospital admin cotroller in the backend");
    const { id } = req.params;

    const deletedAdmin = await userModel.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital admin not found",
          error: null,
        })
      );
    }

    // Remove admin reference from hospital if it exists
    await hospitalModel.updateOne(
      { hospital_admin: id },
      { $unset: { hospital_admin: "" } }
    );

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital admin deleted successfully",
        data: deletedAdmin,
      })
    );
  } catch (error) {
    console.error("Delete Hospital Admin Error:", error.message);
    next(error);
  }
};

export const getHospitalAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hospitalAdmin = await userModel.findById(id).select("-password");

    if (!hospitalAdmin) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital admin not found",
          error: null,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital admin retrieved successfully",
        data: hospitalAdmin,
      })
    );
  } catch (error) {
    console.error("Get Hospital Admin by ID Error:", error.message);
    next(error);
  }
};

export const getAllHospitalAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", search = "" } = req.query;

    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortField = sort.replace("-", "");
    const sortOptions = { [sortField]: sortOrder };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const isPaginationDisabled = isNaN(pageNum) || isNaN(limitNum);

    // Base query: only hospital admins
    const searchQuery = { role: "hospital_admin" };

    // If there's a search term, use regex on fullName, email
    if (search) {
      const regex = new RegExp(search, "i");
      searchQuery.$or = [
        { fullName: { $regex: regex } },
        { email: { $regex: regex } },
      ];
    }

    if (isPaginationDisabled) {
      // Fetch all hospital admins without pagination
      const hospitalAdmins = await userModel.find(searchQuery).populate({
        path: "hospital",
        select: "name",
        match: {
          $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
        },
      });

      // Filter out admins with deleted or missing hospitals
      const filteredAdmins = hospitalAdmins.filter(
        (admin) => admin.hospital // Remove admins with deleted hospitals (null after match)
      );

      return res.status(200).json(
        createResponse({
          isSuccess: true,
          statusCode: 200,
          message: "All hospital admins fetched successfully",
          data: {
            hospitalAdmins: filteredAdmins,
            pagination: null,
          },
          error: null,
        })
      );
    }

    // Paginated query
    const result = await paginate(userModel, searchQuery, {
      page: pageNum,
      limit: limitNum,
      sort: sortOptions,
      populate: {
        path: "hospital",
        select: "name",
        match: {
          $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
        },
      },
    });

    // Filter out hospital admins whose associated hospitals were deleted
    result.data = result.data.filter((admin) => admin.hospital);

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Hospital admins retrieved successfully",
      data: result.data.map((admin) => admin.toObject()),
      pagination: {
        totalCount: result.totalCount,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Get All Hospital Admins Error:", error.message);
    next(error);
  }
};

export const getDashboardStatsForHospitalAdmin = async (req, res, next) => {
  try {
    const hospitalId = req.user.hospital; // Assuming req.user has the hospital ID
    console.log("The hospital ID is", hospitalId);

    // Count associated documents
    const totalDoctors = await Doctor.countDocuments({ hospital: hospitalId });
    const totalAppointments = await Appointment.countDocuments({
      hospital: hospitalId,
    });
    const totalCampaigns = await Campaign.countDocuments({
      hospital: hospitalId,
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    });
    const totalMedicalTests = await MedicalTest.countDocuments({
      hospital: hospitalId,
    });
    const totalTestBookings = await TestBooking.countDocuments({
      hospital: hospitalId,
    });

    const stats = [
      {
        label: "Total Doctors",
        number: totalDoctors.toString(),
      },
      {
        label: "Total Medical Tests",
        number: totalMedicalTests.toString(),
      },
      {
        label: "Total Test Bookings",
        number: totalTestBookings.toString(),
      },
    ];

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Dashboard stats fetched successfully",
        data: {
          totalDoctors,
          totalAppointments,
          totalCampaigns,
          totalMedicalTests,
          totalTestBookings,
          stats,
        },
      })
    );
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error.message);
    next(error);
  }
};
