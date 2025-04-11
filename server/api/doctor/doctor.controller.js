import doctorModel from "../../models/doctor.model.js";
import createResponse from "../../utils/responseBuilder.js";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import { paginate } from "../../utils/paginationUtil.js";
import { validateDoctorInput } from "../../utils/validationUtils.js";
import fs from "fs";
import bcryptjs from "bcryptjs";
import Notification from "../../models/notification.model.js";
import userModel from "../../models/user.model.js";
import { logActivity } from "../activity/activity.controller.js";

export const createDoctor = async (req, res, next) => {
  try {
    console.log("The request body in the create doctor is", req.body);
    if (typeof req.body.qualifications === "string") {
      req.body.qualifications = JSON.parse(req.body.qualifications);
    }

    // Validate input with Joi
    await validateDoctorInput.validateAsync(req.body);

    const {
      fullName,
      phone,
      address,
      email,
      password,
      gender,
      specialization,
      qualifications,
      consultationFee,
      availability,
      hospital,
      yearsOfExperience,
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Registration failed. Email is already in use.",
          error: null,
        })
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Validate file uploads
    if (!req.files?.certificationImage || !req.files?.doctorProfileImage) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Certification image and doctor profile image are required.",
          error: null,
        })
      );
    }

    // Upload images to Cloudinary
    let certificationImageResult, doctorProfileImageResult;
    try {
      [certificationImageResult, doctorProfileImageResult] = await Promise.all([
        cloudinary.v2.uploader.upload(req.files.certificationImage[0].path, {
          folder: "MedConnect/Doctor/Certifications",
        }),
        cloudinary.v2.uploader.upload(req.files.doctorProfileImage[0].path, {
          folder: "MedConnect/Doctor/ProfileImages",
        }),
      ]);
    } catch (uploadError) {
      return res.status(500).json(
        createResponse({
          isSuccess: false,
          statusCode: 500,
          message: "Error uploading images to Cloudinary.",
          error: uploadError.message,
        })
      );
    }

    // Delete uploaded files from local storage
    fs.unlinkSync(req.files.certificationImage[0].path);
    fs.unlinkSync(req.files.doctorProfileImage[0].path);

    // Parse qualifications and availability safely
    let parsedQualifications, parsedAvailability;
    try {
      parsedQualifications =
        typeof qualifications === "string"
          ? JSON.parse(qualifications)
          : qualifications;
      parsedAvailability =
        typeof availability === "string"
          ? JSON.parse(availability)
          : availability;
    } catch (parseError) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid JSON format for qualifications or availability.",
          error: parseError.message,
        })
      );
    }

    // Create doctor record
    const newDoctor = await doctorModel.create({
      fullName,
      phone,
      address,
      email,
      password: hashedPassword,
      role: "doctor",
      gender,
      specialization,
      qualifications: parsedQualifications,
      certificationImage: certificationImageResult.secure_url,
      consultationFee,
      availability: parsedAvailability,
      hospital,
      yearsOfExperience,
      doctorProfileImage: doctorProfileImageResult.secure_url,
      isVerified: true,
    });

    await logActivity("doctor_created", {
      // Core Activity Info
      title: `Doctor Created: ${newDoctor.fullName}`,
      description: `Doctor ${newDoctor.fullName} (${newDoctor.email}) was added by ${req.user?.fullName}.`,

      // Actor Info
      performedBy: {
        role: req.user?.role || "hospital_admin",
        userId: req.user?._id,
        name: req.user?.fullName,
      },

      visibleTo: ["hospital_admin"],
    });

    const doctorObject = newDoctor.toObject();
    delete doctorObject.password;

    const systemAdmins = await userModel.find({ role: "system_admin" });

    const notifications = systemAdmins.map((admin) => ({
      user: admin._id,
      message: `A new doctor named ${newDoctor.fullName} has been added to the system.`,
      type: "doctor",
      relatedId: newDoctor._id,
    }));

    await Notification.insertMany(notifications);

    // ✅ Emit real-time notification via Socket.io
    const io = req.app.get("socketio");
    systemAdmins.forEach((admin) => {
      io.to(admin._id.toString()).emit("new-notification", {
        message: `New doctor ${newDoctor.fullName} added.`,
      });
    });

    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Doctor created successfully.",
        data: doctorObject,
        error: null,
      })
    );
  } catch (error) {
    console.error(error);
    console.error("Error creating doctor:", error.message);

    if (error.details) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Validation failed.",
          error: error.details.map((err) => err.message),
        })
      );
    }

    return next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("The doctor id is", id);
    if (!id) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Doctor ID is required for updating.",
          error: null,
        })
      );
    }
    // Check if files are received
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files received in the request.");
    } else {
      console.log("Files received:", req.files);
    }

    // Find the doctor
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Doctor not found.",
          error: null,
        })
      );
    }

    // Parse qualifications and availability safely
    let parsedQualifications = doctor.qualifications;
    let parsedAvailability = doctor.availability;

    if (req.body.qualifications) {
      try {
        parsedQualifications =
          typeof req.body.qualifications === "string"
            ? JSON.parse(req.body.qualifications)
            : req.body.qualifications;
      } catch (parseError) {
        return res.status(400).json(
          createResponse({
            isSuccess: false,
            statusCode: 400,
            message: "Invalid JSON format for qualifications.",
            error: parseError.message,
          })
        );
      }
    }

    if (req.body.availability) {
      try {
        parsedAvailability =
          typeof req.body.availability === "string"
            ? JSON.parse(req.body.availability)
            : req.body.availability;
      } catch (parseError) {
        return res.status(400).json(
          createResponse({
            isSuccess: false,
            statusCode: 400,
            message: "Invalid JSON format for availability.",
            error: parseError.message,
          })
        );
      }
    }

    // Hash new password if provided
    let hashedPassword = doctor.password;
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(req.body.password, salt);
    }

    // Handle optional image uploads
    let certificationImageUrl = doctor.certificationImage;
    let doctorProfileImageUrl = doctor.doctorProfileImage;

    // Check for existing image URLs sent from frontend
    if (req.body.doctorProfileImageUrl) {
      console.log(
        "Using existing profile image URL:",
        req.body.doctorProfileImageUrl
      );
      doctorProfileImageUrl = req.body.doctorProfileImageUrl;
    }

    if (req.body.certificationImageUrl) {
      console.log(
        "Using existing certification image URL:",
        req.body.certificationImageUrl
      );
      certificationImageUrl = req.body.certificationImageUrl;
    }

    try {
      if (req.files?.certificationImage) {
        const file = req.files.certificationImage[0];
        if (!file.mimetype.startsWith("image/")) {
          return res.status(400).json(
            createResponse({
              isSuccess: false,
              statusCode: 400,
              message: "Certification image must be a valid image file.",
              error: null,
            })
          );
        }

        console.log("Got the new certification image", file);
        const certificationImageResult = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: "MedConnect/Doctor/Certifications",
          }
        );
        certificationImageUrl = certificationImageResult.secure_url;
        fs.unlinkSync(file.path);
      }

      if (req.files?.doctorProfileImage) {
        const file = req.files.doctorProfileImage[0];
        if (!file.mimetype.startsWith("image/")) {
          return res.status(400).json(
            createResponse({
              isSuccess: false,
              statusCode: 400,
              message: "Profile image must be a valid image file.",
              error: null,
            })
          );
        }

        console.log("Got the new doctor profile image", file);
        const doctorProfileImageResult = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: "MedConnect/Doctor/ProfileImages",
          }
        );
        doctorProfileImageUrl = doctorProfileImageResult.secure_url;
        fs.unlinkSync(file.path);
      }
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError);
      return res.status(500).json(
        createResponse({
          isSuccess: false,
          statusCode: 500,
          message: "Error uploading images to Cloudinary.",
          error: uploadError.message,
        })
      );
    }

    // Update doctor details
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      id,
      {
        $set: {
          fullName: req.body.fullName || doctor.fullName,
          phone: req.body.phone || doctor.phone,
          address: req.body.address || doctor.address,
          email: req.body.email || doctor.email,
          password: hashedPassword,
          gender: req.body.gender || doctor.gender,
          specialization: req.body.specialization || doctor.specialization,
          qualifications: parsedQualifications,
          certificationImage: certificationImageUrl,
          consultationFee: req.body.consultationFee || doctor.consultationFee,
          availability: parsedAvailability,

          yearsOfExperience:
            req.body.yearsOfExperience || doctor.yearsOfExperience,
          doctorProfileImage: doctorProfileImageUrl,
        },
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(500).json(
        createResponse({
          isSuccess: false,
          statusCode: 500,
          message: "Failed to update doctor.",
          error: null,
        })
      );
    }

    const doctorObject = updatedDoctor.toObject();
    delete doctorObject.password;

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Doctor updated successfully.",
        data: doctorObject,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error updating doctor:", error.message);

    if (error.details) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Validation failed.",
          error: error.details.map((err) => err.message),
        })
      );
    }

    return next(error);
  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      hospital,
      search, // optional search keyword
    } = req.query;

    const query = {};

    // Filter by hospital if provided
    if (hospital) {
      query.hospital = hospital;
    }

    // Add search conditions for name, specialization, or email
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query.$or = [
        { fullName: { $regex: regex } },
        { specialization: { $regex: regex } },
        { email: { $regex: regex } },
      ];
    }

    // Sort options
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortField = sort.replace("-", "");
    const sortOptions = { [sortField]: sortOrder };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // If pagination is not required
    if (!pageNum && !limitNum) {
      const doctors = await doctorModel
        .find(query)
        .sort(sortOptions)
        .populate("hospital", "name");

      return res.status(200).json(
        createResponse({
          isSuccess: true,
          statusCode: 200,
          message: "All doctors fetched successfully",
          data: {
            doctors,
            pagination: null,
          },
          error: null,
        })
      );
    }

    // Pagination metadata
    const result = await paginate(doctorModel, query, {
      page: pageNum,
      limit: limitNum,
      sort: sortOptions,
    });

    // Get paginated doctors with populated hospital names
    const doctors = await doctorModel
      .find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort(sortOptions)
      .populate("hospital", "name");

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Doctors retrieved successfully",
      data: doctors.map((doctor) => doctor.toObject()),
      pagination: {
        totalCount: result.totalCount,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    return next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorModel
      .findById(id)
      .populate("hospital", "name location");

    if (!doctor) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Doctor not found.",
          error: null,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Doctor details fetched successfully.",
        data: doctor,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorModel.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Doctor not found.",
          error: null,
        })
      );
    }

    const systemAdmins = await userModel.find({ role: "system_admin" });

    const notifications = systemAdmins.map((admin) => ({
      user: admin._id,
      message: `Doctor ${doctor.fullName} has been deleted from the system.`,
      type: "doctor",
      relatedId: doctor._id,
    }));

    await Notification.insertMany(notifications);

    // ✅ Emit real-time notification via Socket.io
    const io = req.app.get("socketio");
    systemAdmins.forEach((admin) => {
      io.to(admin._id.toString()).emit("new-notification", {
        message: `Doctor ${doctor.fullName} has been deleted.`,
      });
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Doctor deleted successfully.",
        data: null,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return next(error);
  }
};

export const getDoctorsBySpecialization = async (req, res, next) => {
  try {
    const { specialization } = req.params;
    const { page = 1, limit = 10 } = req.query;
    console.log("The requested specialization:", specialization);

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const sortOptions = { createdAt: -1 };

    // Use the paginate function consistently
    const result = await paginate(
      doctorModel,
      { specialization }, // Filter by specialization
      {
        page: pageNum,
        limit: limitNum,
        sort: sortOptions,
        populate: { path: "hospital", select: "name" }, // Fetch only hospital name
      }
    );

    console.log("Paginated doctors by specialization:", result);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Doctors fetched successfully.",
        data: result.data,
        pagination: {
          totalCount: result.totalCount,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        },
        error: null,
      })
    );
  } catch (error) {
    console.error("Error fetching doctors by specialization:", error);
    return next(error);
  }
};
