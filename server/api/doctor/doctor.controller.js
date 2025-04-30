import bcryptjs from "bcryptjs";
import fs from "fs";
import moment from "moment";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import Appointment from "../../models/appointment.model.js";
import doctorModel from "../../models/doctor.model.js";
import Message from "../../models/message.model.js";
import Notification from "../../models/notification.model.js";
import userModel from "../../models/user.model.js";
import { paginate } from "../../utils/paginationUtil.js";
import createResponse from "../../utils/responseBuilder.js";
import { validateDoctorInput } from "../../utils/validationUtils.js";
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
      io.to(admin._id.toString()).emit("doctor", {
        message: `New doctor ${newDoctor.fullName} added.`,
        createdAt: new Date().toISOString(),
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
  console.log("Fetching all doctors with query:", req.query);
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      hospital,
      search,
    } = req.query;

    const query = {};

    if (hospital) {
      query.hospital = hospital;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { fullName: { $regex: regex } },
        { specialization: { $regex: regex } },
        { email: { $regex: regex } },
      ];
    }

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
        .populate({
          path: "hospital",
          select: "name",
          match: {
            $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
          },
        });

      const filteredDoctors = doctors
        .filter((doctor) => doctor.hospital)
        .map((doctor) => {
          const { availability, ...doctorWithoutAvailability } = doctor;
          return doctorWithoutAvailability;
        });
      console.log("Filtered doctors:", filteredDoctors);

      return res.status(200).json(
        createResponse({
          isSuccess: true,
          statusCode: 200,
          message: "All doctors fetched successfully",
          data: {
            doctors: filteredDoctors,
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
      populate: {
        path: "hospital",
        select: "name",
        match: {
          $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
        },
      },
    });

    // Filter out doctors whose populated hospital is null (deleted)
    result.data = result.data.filter((doc) => doc.hospital);

    // Remove availability from each doctor before sending the response
    const doctorsWithoutAvailability = result.data.map((doctor) => {
      const { availability, ...doctorWithoutAvailability } = doctor.toObject();
      return doctorWithoutAvailability;
    });

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Doctors retrieved successfully",
      data: doctorsWithoutAvailability,
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
      io.to(admin._id.toString()).emit("doctor", {
        message: `Doctor ${doctor.fullName} has been deleted.`,
        createdAt: new Date().toISOString(),
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
    const {
      page = 1,
      limit = 10,
      search = "",
      experience,
      minFee = 0,
      maxFee = 500,
      sort = "recommended",
    } = req.query;

    console.log("Fetching doctors for specialization:", specialization);

    // Build the filter object
    const filter = {
      specialization,
      isActive: true,
      isVerified: true,
    };

    // Add search filter (case-insensitive)
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { hospital: { $regex: search, $options: "i" } }, // Assuming you want to search hospital names too
      ];
    }

    // Add experience filter (using yearsOfExperience from schema)
    if (experience) {
      const experienceRanges = experience.split(",");
      const experienceConditions = [];

      experienceRanges.forEach((range) => {
        switch (range) {
          case "novice":
            experienceConditions.push({ yearsOfExperience: { $lte: 5 } });
            break;
          case "intermediate":
            experienceConditions.push({
              yearsOfExperience: { $gt: 5, $lte: 10 },
            });
            break;
          case "expert":
            experienceConditions.push({ yearsOfExperience: { $gt: 10 } });
            break;
        }
      });

      if (experienceConditions.length > 0) {
        filter.$and = experienceConditions;
      }
    }

    // Add fee range filter (convert consultationFee to number for comparison)
    filter.$expr = {
      $and: [
        { $gte: [{ $toDouble: "$consultationFee" }, Number(minFee)] },
        { $lte: [{ $toDouble: "$consultationFee" }, Number(maxFee)] },
      ],
    };

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case "fee-low-high":
        sortOptions = { consultationFee: 1 }; // Ascending
        break;
      case "fee-high-low":
        sortOptions = { consultationFee: -1 }; // Descending
        break;
      case "experience":
        sortOptions = { yearsOfExperience: -1 }; // Descending
        break;

      default: // 'recommended'
        sortOptions = { createdAt: -1 }; // Newest first
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Use the paginate function with all filters and sorting
    const result = await paginate(doctorModel, filter, {
      page: pageNum,
      limit: limitNum,
      sort: sortOptions,
      populate: [
        { path: "hospital", select: "name" },
        { path: "user", select: "email" },
      ],
    });

    console.log("Filtered doctors result:", {
      count: result.data.length,
      total: result.totalCount,
    });

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

export const getDoctorDashboardStats = async (req, res, next) => {
  try {
    const doctorId = req.user._id;

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId,
    });

    const uniqueUserIds = await Appointment.distinct("user", {
      doctor: doctorId,
    });
    const totalPatients = uniqueUserIds.length;

    const totalUnreadMessages = await Message.countDocuments({
      receiverId: doctorId,
      read: false,
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Doctor dashboard data fetched successfully.",
        data: {
          totalAppointments,
          totalPatients,
          totalUnreadMessages,
        },
      })
    );
  } catch (error) {
    console.error(
      "The error got while fetching stats for doctor dashboard is:",
      error
    );
    next(error);
  }
};

export const getDoctorAppointmentSummary = async (req, res, next) => {
  console.log("Entered doctor appointment summary");

  try {
    const doctorId = req.user._id;

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    console.log("Doctor ID:", doctorId);
    console.log("Today's Start:", todayStart);
    console.log("Today's End:", todayEnd);

    const todaysAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: todayStart, $lte: todayEnd },
    })
      .populate("user", "fullName email phone") // Add more fields if needed
      .sort({ date: 1 });

    console.log("Found today's appointments:", todaysAppointments.length);

    const upcomingAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gt: todayEnd },
    })
      .populate("user", "fullName email phone") // Add more fields if needed
      .sort({ date: 1 });

    console.log("Found upcoming appointments:", upcomingAppointments.length);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Appointment summary fetched successfully",
        data: {
          todaysAppointments,
          upcomingAppointments,
        },
      })
    );
  } catch (error) {
    console.error(
      "The error while getting doctor appointment summary is:",
      error
    );
    next(error);
  }
};
