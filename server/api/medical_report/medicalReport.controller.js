import MedicalReport from "../../models/medicalReport.model.js";
import User from "../../models/user.model.js";
import Hospital from "../../models/hospital.model.js";
import createResponse from "../../utils/responseBuilder.js";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";

export const uploadMedicalReport = async (req, res, next) => {
  try {
    const { reportTitle, doctorName, email, hospitalId } = req.body;
    console.log("The req.body is", req.body)

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json(
        createResponse({
          status: "failed",
          message: "Report file is required",
        })
      );
    }

    // Find the patient by email
    const patient = await User.findOne({ email });
    if (!patient) {
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Patient with this email not found",
        })
      );
    }

    // Find the hospital (optional, if hospital association is needed)
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Hospital not found",
        })
      );
    }

    // Upload the report file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "medical_reports",
      resource_type: "auto",
    });

    // Save the report in the database
    const newReport = new MedicalReport({
      patient: patient._id,
      hospital: hospital._id,
      doctorName,
      reportTitle,
      reportFile: cloudinaryResponse.secure_url, // Store Cloudinary URL
      
    });

    await newReport.save();

    // Success response
    return res.status(201).json(
      createResponse({
        status: "success",
        message: "Medical report uploaded successfully",
        data: newReport,
      })
    );
  } catch (error) {
    console.error("Error uploading medical report:", error);
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const report = await MedicalReport.findById(reportId).populate("hospital", "name location");

    if (!report) {
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Report not found",
        })
      );
    }

    // Ensure only the patient or the hospital admin can access it
    if (req.user.role !== "admin" && report.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json(
        createResponse({
          status: "failed",
          message: "Unauthorized access to this report",
        })
      );
    }

    return res.status(200).json(
      createResponse({
        status: "success",
        message: "Report fetched successfully",
        data: report,
      })
    );
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const report = await MedicalReport.findById(reportId);
    if (!report) {
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Report not found",
        })
      );
    }

    // Only allow hospital admins to delete the report
    if (req.user.role !== "hospital_admin") {
      return res.status(403).json(
        createResponse({
          status: "failed",
          message: "Unauthorized to delete this report",
        })
      );
    }

    await report.deleteOne();

    return res.status(200).json(
      createResponse({
        status: "success",
        message: "Report deleted successfully",
      })
    );
  } catch (error) {
    console.error("Error deleting report:", error);
    next(error);
  }
};

