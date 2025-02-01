import hospitalModel from "../../models/hospital.model.js";
import { validateHospitalInput } from "../../utils/validationUtils.js";
import createResponse from "../../utils/responseBuilder.js";
import fs from "fs";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import { paginate } from "../../utils/paginationUtil.js";

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
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: folderPath,
      });
      hospitalImage = result.secure_url;

      fs.unlinkSync(req.file.path);
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
    const { page = 1, limit = 10, sort = "createdAt" } = req.query;

    // Convert sort query parameter to a sort object
    const sortOrder = sort.startsWith("-") ? -1 : 1;
    const sortField = sort.replace("-", "");
    const sortOptions = { [sortField]: sortOrder };

    // Use the paginate function to fetch hospitals
    const result = await paginate(
      hospitalModel,
      {},
      { page, limit, sort: sortOptions }
    );

    // Send success response
    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospitals fetched successfully.",
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
    next(error); // Pass the error to the globalErrorHandler
  }
};

/**
 * Handles fetching a specific hospital by ID.
 */
export const fetchHospitalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch hospital by ID
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

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Hospital fetched successfully.",
        data: hospital,
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
