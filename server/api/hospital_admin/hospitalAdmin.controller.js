import userModel from "../../models/user.model.js";
import hospitalModel from "../../models/hospital.model.js";
import bcrypt from "bcryptjs";
import createResponse from "../../utils/responseBuilder.js";

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
