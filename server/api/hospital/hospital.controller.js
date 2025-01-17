import hospitalModel from "../../models/hospital.model.js";
import { validateHospitalInput } from "../../utils/validationUtils.js";
import createResponse from "../../utils/responseBuilder.js";
import fs from "fs";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";

/**
 * Handles adding a new hospital.
 */
export const addHospital = async (req, res) => {
  try {
    console.log("The req.body in addHospital is: ", req.body);
    await validateHospitalInput.validateAsync(req.body);

    const { name, location, contactNumber, email, specialties, medicalTests } = req.body;
    let hospitalImage = null;

    console.log("The req.body in addHospital is: ", req.body);

    if (req.file) {
      const folderPath = `MedConnect/Hospital/Images/${name}`; 
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: folderPath,
      });
      hospitalImage = result.secure_url;
       // Delete the file from the server
       fs.unlinkSync(req.file.path);
    }

    const existingHospital = await hospitalModel.findOne({
      $or: [{ name }, { email }],
    });
    if (existingHospital) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "A hospital with the same name or email already exists.",
          error: null,
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
    if (error.isJoi) {
      console.error("Validation Error: ", error.details);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Validation error",
          error: error.details.map((err) => err.message),
        })
      );
    }

    console.error("Add Hospital Error: ", error.message);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "An error occurred while adding the hospital.",
        error: error.message,
      })
    );
  }
};
