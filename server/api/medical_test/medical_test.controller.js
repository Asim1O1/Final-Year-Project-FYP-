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

import { logActivity } from "../activity/activity.controller.js";

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
    await logActivity("medical_test_created", {
      // Core Activity Data
      title: `Medical Test Created: ${testName}`,
      description: `A new medical test named ${testName} with price ${testPrice} was created at ${existingHospital.name}.`,

      // Actor Information
      performedBy: {
        role: req.user?.role,
        userId: req.user?._id,
        name: req.user?.fullName,
      },

      visibleTo: ["hospital_admin"],
    });

    // Link the new medical test to the hospital
    existingHospital.medicalTests.push(newMedicalTest._id);
    await existingHospital.save();

    return res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Medical test created and linked to hospital successfully",
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
    const {
      page = 1,
      limit = 10,
      hospital,
      search = "",
      testType = "",
      minPrice,
      maxPrice,
      sort = "createdAt_desc",
      isHospitalAdmin = false, // New parameter
      adminHospitalId, // New parameter
    } = req.query;

    console.log("📥 Query Params:", {
      page,
      limit,
      hospital,
      search,
      testType,
      minPrice,
      maxPrice,
      sort,
      isHospitalAdmin,
      adminHospitalId,
    });

    // Build dynamic query - start with empty query
    const query = {};

    // Check if request is from hospital admin dashboard
    if (isHospitalAdmin === "true" && adminHospitalId) {
      // For hospital admin, only show tests from their hospital
      query.hospital = adminHospitalId;
      console.log("🏥 Hospital Admin filtering for hospital:", adminHospitalId);
    } else if (hospital) {
      // For general users, apply hospital filter if provided
      query.hospital = hospital;
      console.log("🏥 Filtering by hospital:", hospital);
    }

    if (testType) {
      query.testType = testType;
      console.log("🧪 Filtering by test type:", testType);
    }

    if (search) {
      query.$or = [
        { testName: { $regex: search, $options: "i" } },
        { testDescription: { $regex: search, $options: "i" } },
      ];
      console.log("🔍 Searching by test name or description:", search);
    }

    // Only apply price range if both min and max are provided
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.testPrice = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
      console.log("💰 Price range:", minPrice, "-", maxPrice);
    }

    // Sort options (always applied)
    let sortOptions = {};
    const [sortField, sortOrder] = sort.split("_");

    switch (sortField) {
      case "price":
        sortOptions.testPrice = sortOrder === "asc" ? 1 : -1;
        break;
      case "name":
        sortOptions.testName = sortOrder === "asc" ? 1 : -1;
        break;
      case "createdAt":
      default:
        sortOptions.createdAt = sortOrder === "asc" ? 1 : -1;
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      populate: {
        path: "hospital",
        select: "name location contactNumber",
        match: {
          $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
        },
      },
    };

    console.log("⚙️ Pagination Options:", options);
    console.log("🧪 Final Query:", query);

    const result = await paginate(MedicalTest, query, options);

    console.log("✅ Raw Paginated Result:", {
      count: result.data.length,
      total: result.totalCount,
    });

    // Filter out tests with null or deleted hospitals
    result.data = result.data.filter(
      (test) => test.hospital && test.hospital.isDeleted !== true
    );

    // Remove sensitive or unnecessary fields
    result.data = result.data.map((test) => {
      const { timeSlot, payment, __v, ...filteredTest } = test.toObject();
      return filteredTest;
    });

    // Calculate active filters for frontend
    const activeFilters = {};
    if (isHospitalAdmin === "true" && adminHospitalId) {
      activeFilters.hospital = adminHospitalId;
    } else if (hospital) {
      activeFilters.hospital = hospital;
    }
    if (testType) activeFilters.testType = testType;
    if (search) activeFilters.search = search;
    if (minPrice) activeFilters.minPrice = minPrice;
    if (maxPrice) activeFilters.maxPrice = maxPrice;

    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Medical tests fetched successfully",
        data: {
          tests: result.data,
          pagination: {
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
          },
          activeFilters,
        },
      })
    );
  } catch (error) {
    console.error("❌ Error fetching medical tests:", error);
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
  console.log("Entered the book medical test backend function");
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
    console.log("The hospital is", hospital);

    // Check for existing bookings at the same time
    const existingBooking = await TestBooking.findOne({
      testId,
      hospitalId,
      bookingDate: new Date(bookingDate),
      bookingTime,
      status: { $in: ["pending", "approved", "booked", "confirmed"] },
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

    // Determine status based on payment method

    const status = paymentMethod === "pay_on_site" ? "booked" : "booked";
    const paymentStatus = paymentMethod === "pay_now" ? "Pending" : "Pending";

    // Create new test booking
    const newTestBooking = new TestBooking({
      userId,
      testId,
      hospitalId,
      bookingDate: new Date(bookingDate),
      bookingTime,
      status: status, // Set based on payment method
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod, // Store the payment method
      transactionId: null,
      tokenNumber: paymentMethod === "pay_on_site" ? tokenNumber : null,
    });

    await newTestBooking.save();
    console.log("Test booking created successfully:", newTestBooking._id);

    // Update the MedicalTest status
    await MedicalTest.findByIdAndUpdate(testId, { status });
    console.log(`MedicalTest ${testId} status updated to ${status}`);

    // Get socket.io instance once
    const io = req.app.get("socketio");

    // 1. NOTIFY HOSPITAL ADMIN(S)
    const hospitalAdmins = await User.find({
      role: "hospital_admin",
      hospitalId: hospital._id,
    });

    console.log(
      `Found ${hospitalAdmins.length} admin(s) for hospital: ${hospital.name}`
    );

    if (hospitalAdmins.length > 0) {
      const adminNotifications = hospitalAdmins.map((admin) => ({
        user: admin._id,
        message: `New ${test.testName} test booked by ${
          user.fullName
        } on ${new Date(bookingDate).toLocaleDateString()} at ${bookingTime}`,
        type: "test_booking",
        relatedId: newTestBooking._id,
        hospitalId: hospital._id,
      }));

      await Notification.insertMany(adminNotifications);
      console.log(`Admin notifications inserted in DB.`);

      // Emit real-time to each admin's room
      hospitalAdmins.forEach((admin) => {
        console.log(
          `Emitting 'new-admin-notification' to admin room: ${admin._id}`
        );
        io.to(admin._id.toString()).emit("test_booking", {
          message: `New test booking at ${hospital.name}`,
          bookingDetails: {
            testName: test.testName,
            patientName: user.fullName,
            date: new Date(bookingDate).toLocaleDateString(),
            time: bookingTime,
            tokenNumber: tokenNumber,
          },
          createdAt: new Date().toISOString(),
        });
      });
    } else {
      console.log(`⚠️ No admins found for hospital: ${hospital.name}`);
    }

    // Notify patient
    const userNotification = new Notification({
      user: userId,
      message: `Your ${test.name} test at ${hospital.name} on ${new Date(
        bookingDate
      ).toLocaleDateString()} at ${bookingTime} has been ${
        status === "confirmed" ? "confirmed" : "booked"
      } successfully.${
        tokenNumber ? ` Your token number is ${tokenNumber}.` : ""
      }`,
      type: "test_booking",
      relatedId: newTestBooking._id,
      createdAt: new Date().toISOString(),
    });

    await userNotification.save();
    console.log("✅ User notification created:", userNotification._id);

    // Emit to the room based on user ID
    console.log(`Emitting 'new-notification' to user's room: ${userId}`);
    io.to(userId.toString()).emit("test_booking", {
      message: `Test booking ${
        status === "confirmed" ? "confirmed" : "created"
      }`,
      bookingId: newTestBooking._id,
      createdAt: new Date().toISOString(),
    });

    // 3. SEND CONFIRMATION EMAIL
    const emailData = {
      fullName: user.fullName,
      testName: test.name,
      hospitalName: hospital.name,
      date: new Date(bookingDate).toLocaleDateString(),
      time: bookingTime,
      paymentMethod:
        paymentMethod === "pay_now" ? "Online Payment" : "Pay at Hospital",
      tokenNumber: tokenNumber,
      bookingStatus: status === "confirmed" ? "Confirmed" : "Booked",
      instructions: tokenNumber
        ? "Please arrive 10 minutes early with your token number."
        : "Proceed directly to the test center.",
    };

    await sendEmail(
      user.email,
      emailTemplates.testBooking.subject,
      emailTemplates.testBooking,
      emailData
    );
    console.log("Confirmation email sent to:", user.email);

    // Return success response
    res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: `Test ${
          status === "confirmed" ? "confirmed" : "booked"
        } successfully`,
        data: {
          bookingId: newTestBooking._id,
          paymentRequired: paymentMethod === "pay_now",
          tokenNumber: tokenNumber,
          status: status,
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

export const getHospitalTestBookings = async (req, res, next) => {
  const { hospitalId } = req.params;
  const { status, date, search, page = 1, limit = 10 } = req.query;

  console.log("Fetching test bookings for hospital:", hospitalId, {
    status,
    date,
    search,
  });

  try {
    // 1. Validate hospital ID
    if (!hospitalId) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Hospital ID is required",
        })
      );
    }

    // 2. Check if hospital exists
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

    // 3. Build dynamic query
    const query = { hospitalId };

    // Handle search for populated fields
    if (search) {
      // First find matching tests and users
      const matchingTests = await MedicalTest.find({
        testName: { $regex: search, $options: "i" },
      }).select("_id");

      const matchingUsers = await User.find({
        fullName: { $regex: search, $options: "i" },
      }).select("_id");

      // Use the IDs in the main query
      query.$or = [
        { testId: { $in: matchingTests.map((test) => test._id) } },
        { userId: { $in: matchingUsers.map((user) => user._id) } },
      ];
    }

    // Filter by status if provided and valid
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (status && validStatuses.includes(status)) {
      query.status = status;
    }

    // Filter by date if provided
    if (date) {
      query.bookingDate = {
        $gte: new Date(new Date(date).setHours(0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59)),
      };
    }

    console.log("Final Query:", query);

    // 4. Fetch bookings with pagination
    const skip = (page - 1) * limit;
    const bookings = await TestBooking.find(query)
      .populate("userId", "fullName email phone")
      .populate("testId", "testName testPrice testDescription")
      .sort({ bookingDate: 1, bookingTime: 1 })
      .skip(skip)
      .limit(Number(limit));

    const totalBookings = await TestBooking.countDocuments(query);

    console.log(`Found ${bookings.length} bookings (Total: ${totalBookings})`);

    // 5. Return paginated results
    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message:
          bookings.length > 0
            ? "Test bookings retrieved successfully"
            : "No bookings found for the specified criteria.",
        data: {
          bookings,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalBookings / limit),
            totalBookings,
          },
        },
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
      {
        status,
        paymentStatus: "Paid",
      },
      { new: true }
    ).populate("userId", "fullName email");

    console.log("Test booking status updated:", updatedBooking);

    const io = req.app.get("socketio");

    // Get the current date for createdDate
    const createdDate = new Date();

    // Create notification with createdDate
    const notification = new Notification({
      user: updatedBooking.userId._id,
      message: `Your test booking status has been updated to ${status}.`,
      type: "test_booking",
      relatedId: updatedBooking._id,
      createdAt: createdDate, // Save createdDate to the notification
    });

    // Emit to the user's room instead of their socket ID
    io.to(updatedBooking.userId._id.toString()).emit("test_booking", {
      message: notification.message,
      bookingId: updatedBooking._id,
      type: notification.type,
      user: notification.user,
      createdAt: createdDate, // Send createdDate in the real-time notification
    });

    // Save notification to the database
    await notification.save();
    console.log("✅ Notification saved for updated booking:", notification._id);

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
