import MedicalReport from "../../models/medicalReport.model.js";
import User from "../../models/user.model.js";
import Hospital from "../../models/hospital.model.js";
import createResponse from "../../utils/responseBuilder.js";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import PDFDocument from "pdfkit";
import MedicalTest from "../../models/medicalTest.model.js";
import TestBooking from "../../models/testBooking.model.js";

export const uploadMedicalReport = async (req, res, next) => {
  try {
    const { reportTitle, doctorName, email, hospital, testId } = req.body;
    console.log("The req.body is", req.body);

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

    // Find the hospital
    const hospitalData = await Hospital.findById(hospital);
    if (!hospitalData) {
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Hospital not found",
        })
      );
    }

    // Find the test booking
    const testBooking = await TestBooking.findOne({
      _id: testId,
      userId: patient._id,
      hospitalId: hospitalData._id,
    });
    console.log("The test booking is", testBooking);

    if (!testBooking) {
      return res.status(400).json(
        createResponse({
          status: "failed",
          message: "No test booking found for this patient",
        })
      );
    }

    // Check if the test status allows report upload (either "Completed" or pending a report)
    if (
      testBooking.status !== "Completed" &&
      testBooking.status !== "report_available"
    ) {
      return res.status(400).json(
        createResponse({
          status: "failed",
          message: "Test must be completed before uploading a report",
        })
      );
    }

    // Check if a report already exists for this test
    const existingReport = await MedicalReport.findOne({
      testBooking: testBooking._id,
    });

    if (existingReport) {
      return res.status(400).json(
        createResponse({
          status: "failed",
          message: "A report has already been uploaded for this test",
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
      hospital: hospitalData._id,
      testBooking: testBooking._id, // lowercase t to match schema
      doctorName,
      reportTitle,
      reportFile: cloudinaryResponse.secure_url,
    });

    await newReport.save();

    // Mark test as "Report Available"
    testBooking.status = "report_available";
    await testBooking.save();

    // Update the linked MedicalTest document if it exists
    if (testBooking.testId) {
      const medicalTest = await MedicalTest.findById(testBooking.testId);
      if (medicalTest) {
        medicalTest.report = newReport._id;
        medicalTest.status = "report_available";
        await medicalTest.save();
      }
    }

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

export const getUserMedicalReports = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get logged-in user ID

    const reports = await MedicalReport.find({ patient: userId })
      .populate("hospital")
      .populate({
        path: "testBooking",
        populate: {
          path: "testId",
          model: "MedicalTest",
        },
      });

    return res
      .status(200)
      .json(createResponse({ status: "success", data: reports }));
  } catch (error) {
    console.error("Error fetching medical reports:", error);
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
export const fetchAllReports = async (req, res, next) => {
  try {
    const adminId = req.user.id; // Assuming authentication middleware adds user info

    // Find the hospital linked to this admin
    const hospital = await Hospital.findOne({ admin: adminId });
    if (!hospital) {
      return res.status(403).json(
        createResponse({
          status: "failed",
          message: "Unauthorized: You are not linked to any hospital",
        })
      );
    }

    // Fetch all reports linked to this hospital
    const reports = await MedicalReport.find({ hospital: hospital._id })
      .populate("patient", "name email")
      .populate("test", "testType status appointmentDate");

    return res.status(200).json(
      createResponse({
        status: "success",
        data: reports,
      })
    );
  } catch (error) {
    console.error("Error fetching all reports:", error);
    next(error);
  }
};

export const fetchCompletedTestsByEmail = async (req, res, next) => {
  const { email } = req.query;
  console.log("The email is", email);

  try {
    // Find user by email with role "user"
    const patient = await User.findOne({ email, role: "user" });

    if (!patient) {
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Patient with this email not found or not authorized",
        })
      );
    }

    // Fetch only completed tests that don't have a report
    const completedTests = await TestBooking.find({
      userId: patient._id,
      status: "report_available",
      report: null,
    })
      .populate("testId", "testName")
      .populate("hospitalId", "name location")
      .select("-payment -timeSlot") // Exclude unnecessary fields
      .sort({ testDate: -1 }); // Newest tests first

    console.log("tghe ", completedTests);

    return res.status(200).json(
      createResponse({
        status: "success",
        data: completedTests.map((test) => ({
          testId: test._id,
          testName: test.testId?.testName || "Unknown Test", // Ensure testName exists
          testDate: test.testDate,
          hospital: test.hospitalId,
        })),
      })
    );
  } catch (error) {
    console.error("Error fetching completed tests by email:", error);
    next(error);
  }
};

export const downloadReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id;

    const report = await MedicalReport.findOne({
      _id: reportId,
      patient: userId,
    }).populate("hospital"); // Ensure hospital details are fetched

    if (!report) {
      return res
        .status(404)
        .json(
          createResponse({ status: "failed", message: "Report not found" })
        );
    }

    const doc = new PDFDocument();
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${report.reportTitle}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
    doc
      .fontSize(16)
      .text(`Medical Report: ${report.reportTitle}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Doctor: ${report.doctorName}`);

    // Fix hospital name issue
    doc.text(`Hospital: ${report.hospital ? report.hospital.name : "N/A"}`);

    doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`);
    doc.moveDown();
    doc.text("Download the full report from the following link:");
    doc.text(report.reportFile, { link: report.reportFile, underline: true });
    doc.end();
  } catch (error) {
    console.error("Error downloading report:", error);
    next(error);
  }
};
