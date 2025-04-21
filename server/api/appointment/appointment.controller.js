import createResponse from "../../utils/responseBuilder.js";
import appointmentModel from "../../models/appointment.model.js";
import generateTimeSlots from "../../utils/generateTimeSlots.js";
import userModel from "../../models/user.model.js";
import doctorModel from "../../models/doctor.model.js";
import hospitalModel from "../../models/hospital.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { emailTemplates } from "../../utils/emailTemplates.js";
import Notification from "../../models/notification.model.js";
import { onlineUsers } from "../../server.js";
import { paginate } from "../../utils/paginationUtil.js";

export const bookDoctorAppointment = async (req, res, next) => {
  const {
    userId,
    doctorId,
    date,
    startTime,
    reason,
    hospitalId,
    paymentMethod,
  } = req.body;

  console.log("📥 Incoming Request Body:", req.body);

  try {
    if (
      !userId ||
      !doctorId ||
      !date ||
      !startTime ||
      !reason ||
      !hospitalId ||
      !paymentMethod
    ) {
      console.warn("⚠️ Missing required fields");
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

    if (!["pay_on_site", "pay_now"].includes(paymentMethod)) {
      console.warn("⚠️ Invalid payment method:", paymentMethod);
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

    console.log("🔍 Verifying user, doctor, and hospital...");

    const user = await userModel.findById(userId);
    if (!user) {
      console.warn("❌ User not found:", userId);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
        })
      );
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      console.warn("❌ Doctor not found:", doctorId);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Doctor not found",
        })
      );
    }
    console.log("✅ Doctor found:", doctor.fullName); // Added log to confirm doctor is found

    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      console.warn("❌ Hospital not found:", hospitalId);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found",
        })
      );
    }

    const allSlots = generateTimeSlots();
    console.log("⏰ Available Slots:", allSlots);
    if (!allSlots.includes(startTime)) {
      console.warn("❌ Invalid startTime:", startTime);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid time slot",
        })
      );
    }

    console.log("🔎 Checking for existing appointment...");
    const existingAppointment = await appointmentModel.findOne({
      doctor: doctorId,
      date: new Date(date),
      startTime,
    });

    if (existingAppointment) {
      console.warn("⚠️ Time slot already booked:", startTime);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "This time slot is already booked",
        })
      );
    }

    const endTime = allSlots[allSlots.indexOf(startTime) + 1];
    console.log("🆕 Creating new appointment:", {
      userId,
      doctorId,
      date,
      startTime,
      endTime,
      hospitalId,
      reason,
      paymentMethod,
    });

    const newAppointment = new appointmentModel({
      user: userId,
      doctor: doctorId,
      date: new Date(date),
      startTime,
      reason,
      hospital: hospitalId,
      endTime,
      status: "pending",
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "pay_now" ? "pending" : "not_required",
      paymentId: paymentMethod === "pay_now" ? null : undefined,
    });

    await newAppointment.save();
    console.log("✅ Appointment saved with ID:", newAppointment._id);

    const io = req.app.get("socketio");

    // ================= PATIENT =================
    const patientMessage = `Your appointment with Dr. ${
      doctor.fullName
    } on ${new Date(
      date
    ).toLocaleDateString()} at ${startTime} has been booked.`;

    // Save patient notification
    const patientNotification = new Notification({
      user: userId,
      message: patientMessage,
      type: "appointment",
      relatedId: newAppointment._id,
      createdAt: new Date().toISOString(),
    });
    await patientNotification.save();
    console.log("📩 Patient notification saved to DB for user:", userId);

    // Real-time via room
    console.log(
      "📶 Sending real-time appointment notification to patient room:",
      userId
    );
    io.to(userId.toString()).emit("appointment", {
      id: newAppointment._id,
      message: patientMessage,
      type: "appointment",
      createdAt: new Date().toISOString(),
    });
    console.log("📡 Real-time appointment sent to patient room");

    // ================= DOCTOR =================
    const doctorMessage =
      paymentMethod === "pay_now"
        ? `New paid appointment by ${user.fullName} on ${new Date(
            date
          ).toLocaleDateString()} at ${startTime}`
        : `New appointment request from ${user.fullName} on ${new Date(
            date
          ).toLocaleDateString()} at ${startTime}`;

    // Save doctor notification
    const doctorNotification = new Notification({
      user: doctor._id,
      message: doctorMessage,
      type: "appointment",
      relatedId: newAppointment._id,
      createdAt: new Date().toISOString(),
    });
    await doctorNotification.save();
    console.log("📩 Doctor notification saved to DB for doctor:", doctor._id);

    // Real-time via room
    console.log(
      "📶 Sending real-time appointment notification to doctor room:",
      doctor._id
    );
    io.to(doctor._id.toString()).emit("appointment", {
      id: newAppointment._id,
      message: doctorMessage,
      type: "appointment",
      urgent: paymentMethod === "pay_now",
      createdAt: new Date().toISOString(),
    });
    console.log("📡 Real-time appointment sent to doctor room");

    // ================= HOSPITAL ADMINS =================
    const hospitalAdmins = await userModel.find({
      role: "hospital_admin",
      hospital: hospitalId,
    });

    if (hospitalAdmins?.length > 0) {
      console.log(`📢 Notifying ${hospitalAdmins.length} hospital admins...`);

      const adminMessage = `New appointment with Dr. ${
        doctor.fullName
      } on ${new Date(date).toLocaleDateString()} at ${startTime}`;

      for (const admin of hospitalAdmins) {
        const adminNotification = new Notification({
          user: admin._id,
          message: adminMessage,
          type: "appointment",
          relatedId: newAppointment._id,
          createdAt: new Date().toISOString(),
        });

        await adminNotification.save();
        console.log(`📩 Notification saved to DB for admin: ${admin._id}`);

        // Real-time via room
        console.log(
          `📶 Sending real-time notification to admin room: ${admin._id}`
        );
        io.to(admin._id.toString()).emit("appointment", {
          id: newAppointment._id,
          message: adminMessage,
          type: "appointment",
          doctorId: doctor._id,
          createdAt: new Date().toISOString(),
        });
        console.log(
          `📡 Real-time notification sent to admin room: ${admin._id}`
        );
      }
    } else {
      console.warn("⚠️ No hospital admins found for this hospital");
    }

    console.log("📧 Sending confirmation email to:", user.email);

    const subject = emailTemplates.appointmentBooking.subject;
    const template = emailTemplates.appointmentBooking;

    const data = {
      fullName: user.fullName,
      doctorName: doctor.fullName,
      hospitalName: hospital.name,
      date: new Date(date).toLocaleDateString(),
      startTime: startTime,
    };

    await sendEmail(user.email, subject, template, data);
    console.log("✅ Email sent");

    res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Appointment booked successfully",
        data: {
          appointmentId: newAppointment._id,
          paymentRequired: paymentMethod === "pay_now",
        },
        error: null,
      })
    );
  } catch (error) {
    console.error("❌ Error booking doctor appointment:", error.message);
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status, rejectionReason } = req.body;

  try {
    // Validate status value
    if (!["confirmed", "canceled", "completed"].includes(status)) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message:
            "Invalid status value. Allowed: confirmed, canceled, completed",
          data: null,
          error: null,
        })
      );
    }

    // Find the appointment
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Appointment not found",
          data: null,
          error: null,
        })
      );
    }

    // Fetch user and doctor details
    const user = await userModel.findById(appointment.user);
    const doctor = await doctorModel.findById(appointment.doctor);

    // Update appointment status
    appointment.status = status;
    if (status === "canceled") {
      appointment.rejectionReason = rejectionReason || "No reason provided";
    }

    await appointment.save();

    // Prepare email data
    const data = {
      fullName: user.fullName,
      doctorName: doctor.fullName,
      hospitalName: appointment.hospital,
      date: new Date(appointment.date).toLocaleDateString(),
      startTime: appointment.startTime,
      rejectionReason: rejectionReason || "",
    };

    let subject, template;

    if (status === "confirmed") {
      subject = emailTemplates.appointmentConfirmed.subject;
      template = emailTemplates.appointmentConfirmed;
    } else if (status === "canceled") {
      subject = emailTemplates.appointmentCancelled.subject;
      template = emailTemplates.appointmentCancelled;
    } else if (status === "completed") {
      subject = emailTemplates.appointmentCompleted.subject;
      template = emailTemplates.appointmentCompleted;
    }

    // ✅ Send Email Notification
    await sendEmail(user.email, subject, template, data);

    const io = req.app.get("socketio");

    // ✅ Send in-app + real-time to user
    const userNotification = new Notification({
      user: user._id,
      message:
        status === "confirmed"
          ? `Your appointment with Dr. ${doctor.fullName} on ${new Date(
              appointment.date
            ).toLocaleDateString()} at ${
              appointment.startTime
            } has been confirmed.`
          : status === "canceled"
          ? `Your appointment with Dr. ${doctor.fullName} was canceled. Reason: ${data.rejectionReason}`
          : `Your appointment with Dr. ${doctor.fullName} has been marked as completed.`,
      type: "appointment",
      relatedId: appointment._id,
      createdAt: new Date(),
    });
    await userNotification.save();
    io.to(user._id.toString()).emit("appointment", {
      appointmentId: appointment._id,
      status,
      message: userNotification.message,
      createdAt: new Date().toISOString(),
    });

    // ✅ If canceled, notify doctor as well
    if (status === "canceled") {
      const doctorMessage = `Appointment with ${user.fullName} on ${new Date(
        appointment.date
      ).toLocaleDateString()} at ${appointment.startTime} was canceled by the user.`;
      const doctorNotification = new Notification({
        user: doctor._id,
        message: doctorMessage,
        type: "appointment",
        relatedId: appointment._id,
        createdAt: new Date(),
      });
      await doctorNotification.save();
      io.to(doctor._id.toString()).emit("appointment", {
        appointmentId: appointment._id,
        status,
        message: doctorMessage,
        createdAt: new Date().toISOString(),
      });
    }

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: `Appointment ${status} successfully`,
        data: appointment,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error updating appointment status:", error.message);
    next(error);
  }
};

export const getAvailableTimeSlots = async (req, res, next) => {
  try {
    console.log("getAvailableTimeSlots");
    const { doctorId, date } = req.params;
    const bookedAppointments = await appointmentModel.find({
      doctor: doctorId,
      date: new Date(date),
    });

    const allSlots = generateTimeSlots();
    // Filter out booked slots
    const bookedTimes = bookedAppointments.map((appt) => appt.startTime);
    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    // Send response
    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Available slots fetched successfully",
        data: availableSlots,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error fetching available time slots:", error.message);
    next(error);
  }
};

export const getUserAppointments = async (req, res, next) => {
  const { userId } = req.params;
  const { page, limit } = req.query; // Get pagination query params

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
          data: null,
          error: null,
        })
      );
    }

    // Use the paginate function
    const result = await paginate(
      appointmentModel,
      { user: userId },
      {
        page,
        limit,
        sort: { date: 1 },
        populate: [
          { path: "doctor", select: "fullName specialization" },
          { path: "hospital", select: "name location" },
        ],
      }
    );

    if (result.totalCount === 0) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "No appointments found for this user",
          data: null,
          error: null,
        })
      );
    }

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Appointments fetched successfully",
        data: {
          appointments: result.data,
          pagination: {
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
          },
        },
        error: null,
      })
    );
  } catch (error) {
    console.error("Error fetching user appointments:", error.message);
    next(error);
  }
};

export const getDoctorAppointments = async (req, res, next) => {
  console.log("Fetching doctor appointments");
  const { doctorId } = req.params;
  let { status = "all" } = req.query;
  console.log("The status is", status);

  if (Array.isArray(status)) {
    status = status[0];
  }

  try {
    // Check if the doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Doctor not found",
          data: null,
          error: null,
        })
      );
    }

    // Define the filter object
    const filter = { doctor: doctorId };

    // Add status filter only if it's not "all"
    if (status !== "all") {
      // Ensure the status is a string before calling split
      if (typeof status === "string") {
        const statuses = status.split(",");
        filter.status = { $in: statuses }; // Use $in to match any of the statuses
      } else {
        console.error("Invalid status value:", status);
        return res.status(400).json(
          createResponse({
            isSuccess: false,
            statusCode: 400,
            message: "Invalid status value",
            data: null,
            error: null,
          })
        );
      }
    }

    // Fetch appointments based on the filter
    const appointments = await appointmentModel
      .find(filter)
      .populate("user", "fullName email")
      .populate("hospital", "name location") // Populate hospital details
      .sort({ date: 1 }); // Sort by appointment date

    if (appointments.length === 0) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: `No ${
            status !== "all" ? status : ""
          } appointments found for this doctor`,
          data: null,
          error: null,
        })
      );
    }

    // Return the filtered appointments
    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: `Appointments fetched successfully${
          status !== "all" ? ` (Filter: ${status})` : ""
        }`,
        data: appointments,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error fetching doctor appointments:", error.message);
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;
  const userId = req.user._id; // Authenticated user ID

  const io = req.app.get("socketio"); // Socket.io instance

  try {
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("user doctor");

    if (!appointment) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Appointment not found",
        })
      );
    }

    // Authorization check
    if (appointment.user._id.toString() !== userId.toString()) {
      return res.status(403).json(
        createResponse({
          isSuccess: false,
          statusCode: 403,
          message: "You are not authorized to cancel this appointment",
        })
      );
    }

    // Already canceled?
    if (appointment.status === "canceled") {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Appointment is already canceled",
        })
      );
    }

    appointment.status = "canceled";
    await appointment.save();

    // ===== EMAIL Notification to User =====
    const subject = "🚫 Appointment Canceled";
    const html = `<p>Dear ${appointment.user.name},</p>
      <p>Your appointment with Dr. ${appointment.doctor.name} on ${appointment.date} at ${appointment.startTime} has been canceled.</p>`;
    await sendEmail(appointment.user.email, subject, html);

    const formattedDate = new Date(appointment.date).toLocaleDateString();

    // ===== DB + Real-time Notification: Patient =====
    const patientMessage = `Your appointment with Dr. ${appointment.doctor.name} on ${formattedDate} at ${appointment.startTime} has been canceled.`;

    const patientNotification = new Notification({
      user: appointment.user._id,
      message: patientMessage,
      type: "appointment",
      relatedId: appointment._id,
      createdAt: new Date().toISOString(),
    });
    await patientNotification.save();

    io.to(appointment.user._id.toString()).emit("appointment_cancellation", {
      id: appointment._id,
      message: patientMessage,
      type: "appointment",
      createdAt: new Date().toISOString(),
    });

    // ===== DB + Real-time Notification: Doctor =====
    const doctorMessage = `Appointment with ${appointment.user.name} on ${formattedDate} at ${appointment.startTime} has been canceled.`;

    const doctorNotification = new Notification({
      user: appointment.doctor._id,
      message: doctorMessage,
      type: "appointment",
      relatedId: appointment._id,
      createdAt: new Date().toISOString(),
    });
    await doctorNotification.save();

    io.to(appointment.doctor._id.toString()).emit("appointment_cancellation", {
      id: appointment._id,
      message: doctorMessage,
      type: "appointment",
      createdAt: new Date().toISOString(),
    });

    // ===== Final Response =====
    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Appointment canceled successfully",
        data: appointment,
      })
    );
  } catch (error) {
    console.error("Error canceling appointment:", error.message);
    next(error);
  }
};

export const rescheduleAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;
  const { newDate, newStartTime } = req.body;

  try {
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("user", "name email")
      .populate("doctor", "name email");

    if (!appointment) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Appointment not found",
          data: null,
          error: null,
        })
      );
    }

    // Check if appointment is already completed
    const appointmentDateTime = new Date(
      `${appointment.date} ${appointment.startTime}`
    );
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Cannot reschedule a past or ongoing appointment",
          data: null,
          error: null,
        })
      );
    }

    // Check if new time slot is available
    const existingAppointment = await appointmentModel.findOne({
      doctor: appointment.doctor,
      date: new Date(newDate),
      startTime: newStartTime,
    });

    if (existingAppointment) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "New time slot is already booked",
          data: null,
          error: null,
        })
      );
    }

    // Update appointment
    appointment.date = new Date(newDate);
    appointment.startTime = newStartTime;
    appointment.status = "rescheduled";
    await appointment.save();

    // Send email notification
    const subject = "📅 Appointment Rescheduled";
    const html = `<p>Dear ${appointment.user.name},</p>
      <p>Your appointment with Dr. ${appointment.doctor.name} has been rescheduled to ${appointment.date} at ${appointment.startTime}.</p>`;

    await sendEmail(appointment.user.email, subject, html);

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Appointment rescheduled successfully",
        data: appointment,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error rescheduling appointment:", error.message);
    next(error);
  }
};

export const getAppointmentById = async (req, res, next) => {
  const { appointmentId } = req.params;

  try {
    // Fetch appointment with populated doctor, hospital, and user details
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("doctor", "fullName specialty")
      .populate("hospital", "name location")
      .populate("user", "fullName email");

    if (!appointment) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Appointment not found",
          data: null,
          error: null,
        })
      );
    }

    // Return the appointment details
    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Appointment fetched successfully",
        data: appointment,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error fetching appointment:", error.message);
    next(error);
  }
};

export const deleteAppointments = async (req, res, next) => {
  try {
    const { appointmentIds } = req.body;

    if (
      !appointmentIds ||
      !Array.isArray(appointmentIds) ||
      appointmentIds.length === 0
    ) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid request. Provide an array of appointment IDs.",
          data: null,
          error: null,
        })
      );
    }

    // Find appointments to delete
    const appointments = await appointmentModel.find({
      _id: { $in: appointmentIds },
    });

    if (appointments.length === 0) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "No matching appointments found",
          data: null,
          error: null,
        })
      );
    }

    // Delete appointments
    await appointmentModel.deleteMany({ _id: { $in: appointmentIds } });

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: `${appointments.length} appointment(s) deleted successfully`,
        data: null,
        error: null,
      })
    );
  } catch (error) {
    console.error("Error deleting appointments:", error.message);
    next(error);
  }
};
