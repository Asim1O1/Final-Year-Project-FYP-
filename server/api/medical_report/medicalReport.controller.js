import MedicalReport from "../../models/medicalReport.model.js";
import User from "../../models/user.model.js";
import Hospital from "../../models/hospital.model.js";
import createResponse from "../../utils/responseBuilder.js";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import PDFDocument from "pdfkit";
import MedicalTest from "../../models/medicalTest.model.js";
import TestBooking from "../../models/testBooking.model.js";
import Notification from "../../models/notification.model.js";
import { onlineUsers } from "../../server.js";

export const uploadMedicalReport = async (req, res, next) => {
  try {
    const { reportTitle, doctorName, email, hospital, testId } = req.body;
    console.log("🔍 Received request body:", req.body);

    // Ensure a file is uploaded
    if (!req.file) {
      console.log("❌ No file uploaded.");
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
      console.log(`❌ No patient found with email: ${email}`);
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Patient with this email not found",
        })
      );
    }
    console.log("✅ Patient found:", patient.fullName);

    // Find the hospital
    const hospitalData = await Hospital.findById(hospital);
    if (!hospitalData) {
      console.log(`❌ Hospital not found with ID: ${hospital}`);
      return res.status(404).json(
        createResponse({
          status: "failed",
          message: "Hospital not found",
        })
      );
    }
    console.log("🏥 Hospital found:", hospitalData.name);

    // Find the test booking
    const testBooking = await TestBooking.findOne({
      _id: testId,
      userId: patient._id,
      hospitalId: hospitalData._id,
    });
    console.log("🔍 Test booking found:", testBooking);

    if (!testBooking) {
      console.log("❌ Test booking not found");
      return res.status(400).json(
        createResponse({
          status: "failed",
          message: "No test booking found for this patient",
        })
      );
    }

    // Validate test booking status
    if (testBooking.status !== "completed") {
      console.log(
        "⚠️ Invalid test status for uploading report:",
        testBooking.status
      );
      return res.status(400).json(
        createResponse({
          status: "failed",
          message: "Test must be completed before uploading a report",
        })
      );
    }

    // Check for existing report
    const existingReport = await MedicalReport.findOne({
      testBooking: testBooking._id,
    });

    if (existingReport) {
      console.log(
        "❌ A report already exists for this testBooking ID:",
        testBooking._id
      );
      return res.status(400).json(
        createResponse({
          status: "failed",
          message: "A report has already been uploaded for this test",
        })
      );
    }

    // Upload the report file to Cloudinary
    console.log("☁️ Uploading file to Cloudinary...");
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "medical_reports",
      resource_type: "auto",
    });
    console.log(
      "✅ Cloudinary upload successful:",
      cloudinaryResponse.secure_url
    );

    // Save new medical report
    const newReport = new MedicalReport({
      patient: patient._id,
      hospital: hospitalData._id,
      testBooking: testBooking._id,
      doctorName,
      reportTitle,
      reportFile: cloudinaryResponse.secure_url,
    });

    await newReport.save();
    console.log("📝 New report saved:", newReport._id);

    // Update test booking status
    testBooking.status = "report_available";
    await testBooking.save();
    console.log("🔄 Test booking status updated to 'report_available'");

    // Update medical test if exists
    if (testBooking.testId) {
      const medicalTest = await MedicalTest.findById(testBooking.testId);
      if (medicalTest) {
        medicalTest.report = newReport._id;
        medicalTest.status = "report_available";
        await medicalTest.save();
        console.log("🔄 Linked medical test updated:", medicalTest._id);
      }
    }
    const io = req.app.get("socketio");

    const message = `Your medical report titled "${reportTitle}" has been uploaded.`;

    // Create notification for the user
    const notification = await Notification.create({
      user: patient._id,
      type: "medical_report",
      message,
      relatedId: newReport._id,
    });
    console.log(`📩 Notification saved for patient ${patient._id}`);

    // Emit real-time if user is online (to their room)
    io.to(patient._id.toString()).emit("medical-report", {
      id: newReport._id,
      message,
      type: "medical_report",
      createdAt: new Date().toISOString(),
    });
    console.log(`📡 Real-time notification sent to patient ${patient._id}`);
    // Success response
    return res.status(201).json(
      createResponse({
        status: "success",
        message: "Medical report uploaded successfully",
        data: newReport,
      })
    );
  } catch (error) {
    console.error("❌ Error uploading medical report:", error);
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
    const adminId = req.user.id;
    console.log("The admin ID is", adminId);

    // Find the hospital linked to this admin
    const hospital = await Hospital.findOne({ hospital_admin: adminId });
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
    console.log("The patient is", patient);

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
      status: "completed",
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
    }).populate(["hospital", "patient", "test", "testBooking"]);

    if (!report) {
      return res
        .status(404)
        .json(
          createResponse({ status: "failed", message: "Report not found" })
        );
    }

    // Create a new PDF document with better margins
    const doc = new PDFDocument({
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60,
      },
      size: "A4",
      bufferPages: true,
    });

    // Set response headers for PDF download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${report.reportTitle.replace(/\s+/g, "_")}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.rect(0, 0, doc.page.width, 120).fill("#f0f7ff");

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#003366")
      .text(report.hospital ? report.hospital.name : "Medical Report", 60, 50);

    // Add report generation date on the right
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#555555")
      .text(`Generated: ${formatDate(new Date())}`, doc.page.width - 200, 40, {
        width: 140,
        align: "right",
      });

    // Add document title and header

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#003366")
      .text(report.reportTitle, { align: "center" });

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#888888")
      .text(`Report #${report._id.toString().slice(-6)}`, { align: "center" });

    doc.moveDown(2);

    // Add professional styled section divider
    addSectionDivider(doc, "Patient Information");
    doc.moveDown(0.5);

    // Add patient photo if available
    if (report.patient && report.patient.profileImage) {
      doc.image(report.patient.profileImage, {
        fit: [80, 80],
        align: "right",
      });
    }

    const patientInfo = [
      {
        label: "Patient Name",
        value: report.patient ? `${report.patient.fullName}` : "N/A",
        fontWeight: "bold",
      },
      {
        label: "Patient ID",
        value: report.patient ? report.patient._id : "N/A",
      },
      {
        label: "Gender",
        value: report.patient ? report.patient.gender : "N/A",
      },
      {
        label: "Mobile Number",
        value:
          report.patient && report.patient.phone ? report.patient.phone : "N/A",
      },
      {
        label: "Email",
        value:
          report.patient && report.patient.email ? report.patient.email : "N/A",
      },
    ];

    // Create a styled table-like layout for patient info
    createStyledInfoTable(doc, patientInfo);
    doc.moveDown(2);

    // Report details section with improved styling
    addSectionDivider(doc, "Report Details");
    doc.moveDown(0.5);

    const reportInfo = [
      {
        label: "Doctor",
        value: report.doctorName,
        fontWeight: "bold",
      },
      {
        label: "Hospital",
        value: report.hospital ? report.hospital.name : "N/A",
      },
      {
        label: "Hospital Address",
        value: report.hospital ? report.hospital.location : "N/A",
      },
      {
        label: "Report Date",
        value: formatDate(report.createdAt),
      },
      {
        label: "Test Date",
        value: report.testBooking
          ? formatDate(report.testBooking.bookingDate)
          : "N/A",
      },
    ];

    // Create a styled table-like layout for report info
    createStyledInfoTable(doc, reportInfo);
    doc.moveDown(2);

    // Add professional styled section divider
    addSectionDivider(doc, "Full Report Access");
    doc.moveDown(0.5);

    // Draw a light background for the report access section
    const boxY = doc.y;
    doc
      .rect(50, boxY, doc.page.width - 100, 100)
      .fillAndStroke("#f9f9f9", "#dddddd");

    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#000000")
      .text(
        "To access the complete detailed report with all test results and images, please use the link below:",
        70,
        boxY + 20,
        {
          width: doc.page.width - 140,
        }
      );
    doc.moveDown(0.5);

    // Add styled link
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#0066cc")
      .text(report.reportFile, 70, doc.y, {
        link: report.reportFile,
        underline: true,
        width: doc.page.width - 140,
      });

    // Add footer with page number
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);

      // Add bottom border
      doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill("#f0f7ff");

      // Add footer text
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          `${
            report.hospital ? report.hospital.name : "Medical Center"
          } | Page ${i + 1} of ${totalPages}`,
          60,
          doc.page.height - 25,
          {
            width: doc.page.width - 120,
            align: "center",
          }
        );
    }
    `  `;

    doc.end();
  } catch (error) {
    console.error("Error downloading report:", error);
    next(error);
  }
};

// Helper function to format date
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper function to create styled section dividers
function addSectionDivider(doc, title) {
  // Create stylish section divider with gradient-like appearance
  const y = doc.y;

  // Draw background rectangle
  doc.rect(50, y, doc.page.width - 100, 30).fillAndStroke("#e6f0fa", "#bbddff");

  // Add section title
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#003366")
    .text(title, 70, y + 8);
}

// Helper function to create styled info tables
function createStyledInfoTable(doc, items) {
  const startX = 70;
  const labelWidth = 150;
  const valueX = startX + labelWidth;

  // Draw alternating backgrounds for better readability
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.rect(50, doc.y - 2, doc.page.width - 100, 25).fill("#f9f9f9");
    }

    // Apply highlighting if specified
    if (item.highlight) {
      doc.rect(50, doc.y - 2, doc.page.width - 100, 25).fill("#faffea");
    }

    // Draw label
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#555555")
      .text(`${item.label}:`, startX, doc.y, {
        continued: false,
        width: labelWidth,
      });

    // Save Y position after label
    const valueY = doc.y - 14;

    // Draw value with conditional styling
    doc
      .fontSize(11)
      .font(item.fontWeight === "bold" ? "Helvetica-Bold" : "Helvetica")
      .fillColor("#000000")
      .text(item.value, valueX, valueY);

    doc.moveDown(0.5);
  });
}
