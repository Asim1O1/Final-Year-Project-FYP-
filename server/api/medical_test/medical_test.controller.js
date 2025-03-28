import MedicalTest from "../../models/medicalTest.model.js";
import Hospital from "../../models/hospital.model.js";

import  createResponse  from "../../utils/responseBuilder.js";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import { paginate } from "../../utils/paginationUtil.js";

export const createMedicalTest = async (req, res, next) => {
  const { testName, timeSlot, testPrice, hospital, testDescription } = req.body;

  try {
    // Check if the hospital exists
    const existingHospital = await Hospital.findById(hospital);
    if (!existingHospital) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found",
          error: "Invalid hospital ID",
        })
      );
    }

    let testImage = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      const folderPath = `MedConnect/MedicalTest/Images/${testName.replace(
        /\s+/g,
        "_"
      )}`;
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: folderPath,
        });
        testImage = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json(
          createResponse({
            isSuccess: false,
            statusCode: 500,
            message: "Failed to upload image to Cloudinary.",
            error: cloudinaryError.message,
          })
        );
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    // Create and save the new medical test
    const newMedicalTest = new MedicalTest({
      testName,
      hospital,
      testDescription,
      testPrice,
      testImage,
      timeSlot: {
        time: timeSlot,
        isBooked: false,
      },
    });

    await newMedicalTest.save();

    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Medical test created successfully",
        data: newMedicalTest,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error while creating medical test:", error);
    next(error);
  }
};

/**
 * @desc Get a single medical test by ID
 * @route GET /api/medical-tests/:id
 */
export const getMedicalTestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medicalTest = await MedicalTest.findById(id).populate("hospital");
    if (!medicalTest) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Medical test not found",
          error: "Invalid medical test ID",
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Medical test fetched successfully",
        data: medicalTest,
      })
    );
  } catch (error) {
    console.error("Error fetching medical test:", error);
    next(error);
  }
};

/**
 * @desc Get multiple medical tests with pagination
 * @route GET /api/medical-tests
 */
export const getMedicalTests = async (req, res, next) => {
  try {
    const { page, limit, hospital, search } = req.query;

    let query = {};
    if (hospital) {
      query.hospital = hospital;
    }
    if (search) {
      query.testName = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: "hospital",
    };

    const result = await paginate(MedicalTest, query, options);

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Medical tests fetched successfully",
        data: result,
      })
    );
  } catch (error) {
    console.error("Error fetching medical tests:", error);
    next(error);
  }
};

/**
 * @desc Update a medical test by ID
 * @route PUT /api/medical-tests/:id
 */
export const updateMedicalTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTest = await MedicalTest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("hospital");

    if (!updatedTest) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Medical test not found",
          error: "Invalid medical test ID",
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Medical test updated successfully",
        data: updatedTest,
      })
    );
  } catch (error) {
    console.error("Error updating medical test:", error);
    next(error);
  }
};

/**
 * @desc Delete a single medical test by ID
 * @route DELETE /api/medical-tests/:id
 */
export const deleteMedicalTest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTest = await MedicalTest.findByIdAndDelete(id);
    if (!deletedTest) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Medical test not found",
          error: "Invalid medical test ID",
        })
      );
    }

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Medical test deleted successfully",
      })
    );
  } catch (error) {
    console.error("Error deleting medical test:", error);
    next(error);
  }
};

/**
 * @desc Bulk delete medical tests
 * @route DELETE /api/medical-tests
 */
export const bulkDeleteMedicalTests = async (req, res, next) => {
  try {
    const { testIds } = req.body; // Expecting an array of IDs

    if (!testIds || !Array.isArray(testIds) || testIds.length === 0) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid request. Provide an array of test IDs.",
        })
      );
    }

    const deleteResult = await MedicalTest.deleteMany({
      _id: { $in: testIds },
    });

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: `${deleteResult.deletedCount} medical tests deleted successfully`,
      })
    );
  } catch (error) {
    console.error("Error bulk deleting medical tests:", error);
    next(error);
  }
};

