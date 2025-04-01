import MedicalTest from "../../models/medicalTest.model.js";
import Hospital from "../../models/hospital.model.js";
import User from "../../models/user.model.js";
import TestBooking from "../../models/testBooking.model.js";
import Notification from "../../models/notification.model.js";

import fs from "fs";

import createResponse from "../../utils/responseBuilder.js";
import cloudinary from "../../imageUpload/cloudinaryConfig.js";
import { paginate } from "../../utils/paginationUtil.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { emailTemplates } from "../../utils/emailTemplates.js";

export const createMedicalTest = async (req, res, next) => {
  const { testName, testPrice, hospital, testDescription } = req.body;
  console.log("Request body:", req.body);

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
      query.testName = { $regex: search, $options: "i" };
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: {
        path: "hospital",
        select: "name location contactNumber", // Fetch only hospital name and location
      },
    };

    let result = await paginate(MedicalTest, query, options);

    // **Manually Remove `timeSlot` and `payment` Before Sending Response**
    result.data = result.data.map((test) => {
      const { timeSlot, payment, ...filteredTest } = test.toObject();
      return filteredTest;
    });

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
    const existingTest = await MedicalTest.findById(id);

    if (!existingTest) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Medical test not found",
          error: "Invalid medical test ID",
        })
      );
    }

    let testImage = existingTest.testImage;

    // Handle new image upload
    if (req.file) {
      const folderPath = `MedConnect/MedicalTest/Images/${existingTest.testName.replace(
        /\s+/g,
        "_"
      )}`;

      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: folderPath,
        });
        testImage = result.secure_url;

        // Delete old image if it exists
        if (existingTest.testImage) {
          try {
            const oldImagePublicId = existingTest.testImage
              .split("/")
              .pop()
              .split(".")[0];
            await cloudinary.v2.uploader.destroy(
              `MedConnect/MedicalTest/Images/${oldImagePublicId}`
            );
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
          }
        }
      } catch (cloudinaryError) {
        return res.status(500).json(
          createResponse({
            isSuccess: false,
            statusCode: 500,
            message: "Failed to upload new image to Cloudinary.",
            error: cloudinaryError.message,
          })
        );
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    const updatedTest = await MedicalTest.findByIdAndUpdate(
      id,
      { ...updates, testImage },
      { new: true }
    );

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Medical test updated successfully",
        data: updatedTest,
      })
    );
  } catch (error) {
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

export const bookMedicalTest = async (req, res, next) => {
  console.log("entered the book medical test backend function ");
  const {
    userId,
    testId,
    hospitalId,
    bookingDate,
    bookingTime,
    paymentMethod,
  } = req.body;

  console.log("Starting bookMedicalTest with data:", {
    userId,
    testId,
    hospitalId,
    bookingDate,
    bookingTime,
    paymentMethod,
  });

  try {
    // Validate required fields
    if (
      !userId ||
      !testId ||
      !hospitalId ||
      !bookingDate ||
      !bookingTime ||
      !paymentMethod
    ) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "All fields are required",
          data: null,
          error: null,
        })
      );
    }

    // Validate payment method
    if (!["pay_on_site", "pay_now"].includes(paymentMethod)) {
      console.log("Validation failed: Invalid payment method", paymentMethod);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid payment method",
          data: null,
          error: null,
        })
      );
    }

    console.log("Checking if user, test, and hospital exist...");
    // Check if user, test, and hospital exist
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
        })
      );
    }

    const test = await MedicalTest.findById(testId);
    if (!test) {
      console.log("Medical test not found with ID:", testId);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Medical test not found",
        })
      );
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      console.log("Hospital not found with ID:", hospitalId);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found",
        })
      );
    }

    console.log("Checking for existing bookings...");
    // Check for existing bookings at the same time
    const existingBooking = await TestBooking.findOne({
      testId,
      hospitalId,
      bookingDate: new Date(bookingDate),
      bookingTime,
      status: { $in: ["pending", "approved"] },
    });

    if (existingBooking) {
      console.log("Time slot already booked:", {
        testId,
        hospitalId,
        bookingDate,
        bookingTime,
      });
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "This time slot is already booked",
        })
      );
    }

    // Generate token number for pay_on_site bookings
    let tokenNumber = null;
    if (paymentMethod === "pay_on_site") {
      tokenNumber = Math.floor(1000 + Math.random() * 9000).toString();
      console.log("Generated token number for pay_on_site:", tokenNumber);
    }

    console.log("Creating new test booking...");
    // Create new test booking
    const newTestBooking = new TestBooking({
      userId,
      testId,
      hospitalId,
      bookingDate: new Date(bookingDate),
      bookingTime,
      status: "pending",
      paymentStatus: paymentMethod === "pay_now" ? "Pending" : "Pending",
      transactionId: null,
      tokenNumber: paymentMethod === "pay_on_site" ? tokenNumber : null,
    });

    await newTestBooking.save();
    console.log("Test booking created successfully:", newTestBooking._id);

    // Send In-App Notification
    console.log("Creating notification...");
    const notification = new Notification({
      user: userId,
      message: `Your ${test.name} test at ${hospital.name} on ${new Date(
        bookingDate
      ).toLocaleDateString()} at ${bookingTime} has been booked successfully.${
        tokenNumber
          ? ` Your token number is ${tokenNumber}. Please arrive 10 minutes early.`
          : ""
      }`,
      type: "test_booking",
      relatedId: newTestBooking._id,
    });

    await notification.save();
    console.log("Notification created successfully:", notification._id);

    // Emit real-time notification via Socket.io
    console.log("Emitting socket notification...");
    const io = req.app.get("socketio");
    io.to(userId.toString()).emit("new-notification", {
      message: `Your ${test.name} test has been booked.`,
    });
    console.log("Socket notification emitted");

    // Send Confirmation Email
    console.log("Preparing to send confirmation email...");
    const subject = emailTemplates.testBooking.subject;
    const template = emailTemplates.testBooking;

    const data = {
      fullName: user.fullName,
      testName: test.name,
      hospitalName: hospital.name,
      date: new Date(bookingDate).toLocaleDateString(),
      time: bookingTime,
      paymentMethod:
        paymentMethod === "pay_now" ? "Online Payment" : "Pay at Hospital",
      tokenNumber: tokenNumber,
      instructions: tokenNumber
        ? "Please arrive 10 minutes early with your token number to complete payment and take your test."
        : "You can proceed directly to the test center as you've already paid online.",
    };

    await sendEmail(user.email, subject, template, data);
    console.log("Confirmation email sent to:", user.email);

    console.log("Returning success response");
    res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Test booked successfully",
        data: {
          bookingId: newTestBooking._id,
          paymentRequired: paymentMethod === "pay_now",
          tokenNumber: tokenNumber,
        },
        error: null,
      })
    );
  } catch (error) {
    console.error("Error in bookMedicalTest:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    next(error);
  }
};

// Get all test bookings for a specific hospital (for admin)
export const getHospitalTestBookings = async (req, res, next) => {
  const { hospitalId } = req.params;
  console.log("The hospital id", hospitalId);
  const { status, date } = req.query;

  console.log("Fetching test bookings for hospital:", hospitalId);

  try {
    // Validate hospital ID
    if (!hospitalId) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Hospital ID is required",
        })
      );
    }

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found",
        })
      );
    }

    // Build query
    const query = { hospitalId };

    if (status) {
      query.status = status;
    }

    if (date) {
      query.bookingDate = {
        $gte: new Date(new Date(date).setHours(0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59)),
      };
    }

    console.log("Querying test bookings with:", query);

    // Get bookings with populated user and test details
    const bookings = await TestBooking.find(query)
      .populate("userId", "fullName email phone")
      .populate("testId", "testName testPrice testDescription")
      .sort({ bookingDate: 1, bookingTime: 1 });

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Test bookings retrieved successfully",
        data: bookings,
      })
    );
  } catch (error) {
    console.error("Error fetching hospital test bookings:", {
      message: error.message,
      stack: error.stack,
    });
    next(error);
  }
};

// Update test booking status (for admin)
export const updateTestBookingStatus = async (req, res, next) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  console.log("Updating test booking status:", { bookingId, status });

  try {
    // Validate input
    if (!bookingId || !status) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Booking ID and status are required",
        })
      );
    }

    // Check if booking exists
    const booking = await TestBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Test booking not found",
        })
      );
    }

    // Validate status transition
    const validStatuses = ["pending", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid status",
        })
      );
    }

    // Update booking
    const updatedBooking = await TestBooking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate("userId", "fullName email");

    console.log("Test booking status updated:", updatedBooking);

    // Send notification to user if status changed to completed
    if (status === "completed" || status === "cancelled") {
      let notificationMessage = "";
      let socketMessage = "";

      if (status === "completed") {
        notificationMessage = `Your ${updatedBooking.testId.name} test has been completed.`;
        socketMessage = `Your test has been completed.`;
      } else if (status === "cancelled") {
        notificationMessage = `Your ${updatedBooking.testId.name} test appointment has been cancelled.`;
        socketMessage = `Your test appointment has been cancelled.`;
      }
      await notification.save();

      // Emit real-time notification
      const io = req.app.get("socketio");
      io.to(booking.userId.toString()).emit("new-notification", {
        message: `Your test has been completed.`,
      });
    }

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Test booking status updated successfully",
        data: updatedBooking,
      })
    );
  } catch (error) {
    console.error("Error updating test booking status:", {
      message: error.message,
      stack: error.stack,
    });
    next(error);
  }
};

// Get all test bookings for a specific user
export const getUserTestBookings = async (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.query;

  console.log("Fetching test bookings for user:", userId);

  try {
    // Validate user ID
    if (!userId) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "User ID is required",
        })
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
        })
      );
    }

    // Build query
    const query = { userId };
    if (status) {
      query.status = status;
    }

    console.log("Querying user test bookings with:", query);

    // Get bookings with populated test and hospital details
    const bookings = await TestBooking.find(query)
      .populate("testId", "name price duration")
      .populate("hospitalId", "name address")
      .sort({ bookingDate: -1, bookingTime: -1 });

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "User test bookings retrieved successfully",
        data: bookings,
      })
    );
  } catch (error) {
    console.error("Error fetching user test bookings:", {
      message: error.message,
      stack: error.stack,
    });
    next(error);
  }
};
