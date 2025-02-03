import userModel from "../../models/user.model.js";
import hospitalModel from "../../models/hospital.model.js";
import bcrypt from "bcryptjs";
import createResponse from "../../utils/responseBuilder.js";
import { paginate } from "../../utils/paginationUtil.js";

export const createHospitalAdmin = async (req, res, next) => {
  try {
    const { fullName, userName, email, password, gender, phone, hospitalId } =
      req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "User with this email or username already exists",
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the hospital admin user
    const hospitalAdmin = await userModel.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
      gender,
      phone,
      role: "hospital_admin",
      hospital: hospitalId,
    });

    // Assign the hospital admin to the hospital
    hospital.hospital_admin = hospitalAdmin._id;

    await hospital.save();

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

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedAdmin = await userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedAdmin) {
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
        message: "Hospital admin updated successfully",
        data: updatedAdmin,
      })
    );
  } catch (error) {
    console.error("Update Hospital Admin Error:", error.message);
    next(error);
  }
};

export const deleteHospitalAdmin = async (req, res, next) => {
  try {
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
    const { page = 1, limit = 10, sort = "createdAt" } = req.query;

    // Convert sort query parameter to a sort object
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortField = sort.replace("-", "");
    const sortOptions = { [sortField]: sortOrder };

    // Ensure page and limit are numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await paginate(
      userModel,
      { role: "hospital_admin" },
      { page: pageNum, limit: limitNum, sort: sortOptions }
    );

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital admins retrieved successfully",
        data: {
          hospitalAdmins: result.docs,
          pagination: {
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
          },
        },
      })
    );
  } catch (error) {
    console.error("Get All Hospital Admins Error:", error.message);
    next(error);
  }
};
