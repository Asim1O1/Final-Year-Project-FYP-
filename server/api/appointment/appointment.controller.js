import createResponse from "../../utils/responseBuilder.js";
import appointmentModel from "../../models/appointment.model.js";
import generateTimeSlots from "../../utils/generateTimeSlots.js";
import userModel from "../../models/user.model.js";
import doctorModel from "../../models/doctor.model.js";
import hospitalModel from "../../models/hospital.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { emailTemplates } from "../../utils/emailTemplates.js";
import Notification from "../../models/notification.model.js";

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

    // Check if user, doctor, and hospital exist
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
        })
      );

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor)
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Doctor not found",
        })
      );

    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital)
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "Hospital not found",
        })
      );

    const allSlots = generateTimeSlots();
    if (!allSlots.includes(startTime)) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Invalid time slot",
        })
      );
    }

    const existingAppointment = await appointmentModel.findOne({
      doctor: doctorId,
      date: new Date(date),
      startTime,
    });

    if (existingAppointment) {
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "This time slot is already booked",
        })
      );
    }

    // Create a new appointment
    const newAppointment = new appointmentModel({
      user: userId,
      doctor: doctorId,
      date: new Date(date),
      startTime,
      reason,
      hospital: hospitalId,
      endTime: allSlots[allSlots.indexOf(startTime) + 1],
      status: "pending",
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "pay_now" ? "pending" : "not_required",
      paymentId: paymentMethod === "pay_now" ? null : undefined,
    });

    await newAppointment.save();

    const patientNotification = new Notification({
      user: userId, // patient's user ID
      message: `Your appointment with Dr. ${doctor.fullName} on ${new Date(
        date
      ).toLocaleDateString()} at ${startTime} has been booked.`,
      type: "appointment",
      relatedId: newAppointment._id,
    });
    await patientNotification.save();

    const io = req.app.get("socketio");

    // ✅ 2. Send Notification to DOCTOR (if linked to a User account)
    if (doctor.user) {
      // Assuming `doctor.user` is the reference to User model
      const doctorNotification = new Notification({
        user: doctor.user, // doctor's linked user ID
        message: `New appointment booked with you on ${new Date(
          date
        ).toLocaleDateString()} at ${startTime} by ${user.fullName}.`,
        type: "appointment",
        relatedId: newAppointment._id,
      });
      await doctorNotification.save();

      // Real-time Socket.io notification to doctor
      io.to(doctor.user.toString()).emit("new-notification", {
        message: `New appointment booked with you by ${user.fullName}.`,
      });
    } else {
      console.warn(
        "Doctor is not linked to a User account. Notification skipped."
      );
    }

    // ✅ 3. Send Notifications to HOSPITAL ADMINS (if any exist)
    const hospitalAdmins = await userModel.find({
      role: "hospital_admin",
      hospital: hospitalId,
    });

    if (hospitalAdmins?.length > 0) {
      for (const admin of hospitalAdmins) {
        const adminNotification = new Notification({
          user: admin._id, // admin's user ID
          message: `New appointment booked with Dr. ${
            doctor.fullName
          } on ${new Date(date).toLocaleDateString()} at ${startTime}.`,
          type: "appointment",
          relatedId: newAppointment._id,
        });
        await adminNotification.save();

        // Real-time Socket.io notification to admin
        io.to(admin._id.toString()).emit("new-notification", {
          message: `New appointment booked with Dr. ${doctor.fullName}.`,
        });
      }
    } else {
      console.warn("No hospital admins found. Notifications skipped.");
    }
    // ✅ **Send Confirmation Email**
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
    console.error("Error booking doctor appointment:", error.message);
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

    // ✅ Send In-App Notification
    const notification = new Notification({
      user: user._id,
      message:
        status === "confirmed"
          ? `Your appointment with Dr. ${doctor.fullName} on ${data.date} has been confirmed.`
          : status === "canceled"
          ? `Your appointment with Dr. ${doctor.fullName} was canceled. Reason: ${data.rejectionReason}`
          : `Your appointment with Dr. ${doctor.fullName} has been updated.`, // Fallback message
      type: "appointment",
      relatedId: appointment._id,
    });

    await notification.save();

    // ✅ Emit Real-Time Event
    const io = req.app.get("socketio");
    io.to(user._id.toString()).emit("appointment-status-update", {
      appointmentId: appointment._id,
      status,
      message: notification.message,
    });

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

    // Fetch appointments related to this user
    const appointments = await appointmentModel
      .find({ user: userId })
      .populate("doctor", "name specialty") // Populate doctor details
      .populate("hospital", "name location") // Populate hospital details
      .sort({ date: 1 }); // Sort by appointment date

    if (appointments.length === 0) {
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

    // Return the user's appointments
    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Appointments fetched successfully",
        data: appointments,
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

  try {
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

    appointment.status = "canceled";
    await appointment.save();

    const subject = "🚫 Appointment Canceled";
    const html = `<p>Dear ${appointment.user.name},</p>
      <p>Your appointment with Dr. ${appointment.doctor.name} on ${appointment.date} at ${appointment.startTime} has been canceled.</p>`;

    await sendEmail(appointment.user.email, subject, html);

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Appointment canceled successfully",
        data: appointment,
        error: null,
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
    const { appointmentIds } = req.body; // Accepts single ID or multiple IDs in an array

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
