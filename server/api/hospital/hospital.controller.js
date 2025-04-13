import hospitalModel from "../../models/hospital.model.js";
import doctorModel from "../../models/doctor.model.js"
import medicalTestModel from "../../models/medicalTest.model.js"
import { validateHospitalInput } from "../../utils/validationUtils.js";
import createResponse from "../../utils/responseBuilder.js";
import fs from "fs";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import { paginate } from "../../utils/paginationUtil.js";
import { logActivity } from "../activity/activity.controller.js";

/**
 * Handles adding a new hospital.
 */
export const addHospital = async (req, res, next) => {
  try {
    console.log("The req.body in addHospital is: ", req.body);
    await validateHospitalInput.validateAsync(req.body);

    const { name, location, contactNumber, email, specialties, medicalTests } =
      req.body;
    let hospitalImage = null;

    if (req.file) {
      const folderPath = `MedConnect/Hospital/Images/${name}`;
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: folderPath,
        });
        hospitalImage = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        throw new Error("Failed to upload image to Cloudinary.");
      } finally {
        fs.unlinkSync(req.file.path); // Delete the file from local storage
      }
    }

    const existingHospital = await hospitalModel.findOne({
      $or: [{ name }, { email }],
    });
    if (existingHospital) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Hospital with the same name or email already exists.",
          error: null,
          data: null,
        })
      );
    }

    const newHospital = await hospitalModel.create({
      name,
      location,
      contactNumber,
      email,
      specialties: specialties || [],
      medicalTests: medicalTests || [],
      hospitalImage,
    });

    await newHospital.save();
    await logActivity("hospital_registration", {
      // Core Activity Data
      title: `Hospital Registered: ${newHospital.name}`,
      description: `New hospital named ${newHospital.name} has been registered.`,

      performedBy: {
        role: req?.user?.role || "system_admin", // Role of the actor performing this action, defaulting to system_admin if not available
        userId: req?.user?._id,
        name: req?.user?.fullName,
      },
      visibleTo: ["system_admin"],
    });

    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Hospital added successfully.",
        data: newHospital,
        error: null,
      })
    );
  } catch (error) {
    console.log(error);
    if (error.isJoi) {
      error.statusCode = 400;
      error.message = "Validation error";
      error.details = error.details.map((err) => err.message);
    }
    next(error); // Pass the error to the globalErrorHandler
  }
};

export const fetchHospitals = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      sort = "createdAt",
      search = "",
      speciality,
    } = req.query;

    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortField = sort.replace("-", "");
    const sortOptions = { [sortField]: sortOrder };

    // Build dynamic query filters
    const queryFilter = {};

    // Search by hospital name (case-insensitive)
    if (search) {
      queryFilter.name = { $regex: search, $options: "i" };
    }

    // Filter by speciality
    if (speciality) {
      queryFilter.speciality = speciality;
    }

    // No pagination
    if (!page && !limit) {
      const hospitals = await hospitalModel
        .find(queryFilter)
        .sort(sortOptions)
        .populate({
          path: "medicalTests",
          select: "testName testDescription testPrice status testDate",
          match: { status: { $ne: "cancelled" } },
          options: { sort: { testName: 1 } },
        });

      hospitals.forEach((hospital, index) => {
        console.log(`Hospital ${index + 1}:`, {
          name: hospital.name,
          speciality: hospital.speciality,
          testCount: hospital.medicalTests?.length || 0,
        });
      });

      return res.status(200).json(
        createResponse({
          isSuccess: true,
          statusCode: 200,
          message: "Hospitals with medical tests fetched successfully.",
          data: {
            hospitals,
            pagination: null,
          },
        })
      );
    }

    // With pagination
    const result = await paginate(hospitalModel, queryFilter, {
      page: page || 1,
      limit: limit || 10,
      sort: sortOptions,
      populate: {
        path: "medicalTests",
        select: "testName testDescription testPrice status testDate",
        match: { status: { $ne: "cancelled" } },
        options: { sort: { testName: 1 } },
      },
    });

    result.data.forEach((hospital, index) => {
      console.log(`Hospital ${index + 1}:`, {
        name: hospital.name,
        speciality: hospital.speciality,
        testCount: hospital.medicalTests?.length || 0,
      });
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospitals with medical tests fetched successfully.",
        data: {
          hospitals: result.data,
          pagination: {
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
          },
        },
      })
    );
  } catch (error) {
    console.error("❌ Error in fetchHospitals:", error);
    next(error);
  }
};

/**
 * Handles fetching a specific hospital by ID.
 */


export const fetchHospitalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch hospital
    const hospital = await hospitalModel.findById(id);
    if (!hospital) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found.",
          error: null,
          data: null,
        })
      );
    }

    // Fetch doctors
    const doctors = await doctorModel.find({ hospital: id });

    // Fetch medical tests
    const medicalTests = await medicalTestModel.find({ hospital: id });

    console.log("Doctors found:", doctors);
    console.log("Medical tests found:", medicalTests);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital, doctors, and medical tests fetched successfully.",
        data: {
          hospital,
          doctors,
          medicalTests,
        },
        error: null,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Handles updating an existing hospital.
 */
export const updateHospital = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("The req bodys is", req.body);

    // Validate the input fields before updating
    await validateHospitalInput.validateAsync(req.body);

    const { name, location, contactNumber, email, specialties, medicalTests } =
      req.body;
    let hospitalImage = null;

    // Handle hospital image update if a new file is uploaded
    if (req.file) {
      const folderPath = `MedConnect/Hospital/Images/${name}`;
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: folderPath,
      });
      hospitalImage = result.secure_url;

      // Delete the file from the server
      fs.unlinkSync(req.file.path);
    }

    // Check if the hospital exists
    const hospital = await hospitalModel.findById(id);
    if (!hospital) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found.",
          error: null,
          data: null,
        })
      );
    }

    // Update hospital details
    hospital.name = name || hospital.name;
    hospital.location = location || hospital.location;
    hospital.contactNumber = contactNumber || hospital.contactNumber;
    hospital.email = email || hospital.email;
    hospital.specialties = specialties || hospital.specialties;
    hospital.medicalTests = medicalTests || hospital.medicalTests;
    hospital.hospitalImage = hospitalImage || hospital.hospitalImage;

    await hospital.save();

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital updated successfully.",
        data: hospital,
        error: null,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Handles deleting an existing hospital.
 */
export const deleteHospital = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the hospital exists
    const hospital = await hospitalModel.findById(id);
    if (!hospital) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found.",
          error: null,
          data: null,
        })
      );
    }

    // Delete hospital from database
    await hospitalModel.findByIdAndDelete(id);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital deleted successfully.",
        data: null,
        error: null,
      })
    );
  } catch (error) {
    next(error);
  }
};
