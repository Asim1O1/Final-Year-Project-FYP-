import express from "express";
import createResponse from "../../utils/responseBuilder.js";
import appointmentModel from "../../models/appointment.model.js";
import generateTimeSlots from "../../utils/generateTimeSlots.js";
import userModel from "../../models/user.model.js";
import doctorModel from "../../models/doctor.model.js";
import hospitalModel from "../../models/hospital.model.js";
import { sendEmail } from "../../utils/sendEmail.js";

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
    // Validate input
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

    // Check if the paymentMethod is valid
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

    // Check if the user, doctor, and hospital exist
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

    // Check if the time slot is valid
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

    // Check if the slot is already booked
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
      status: "pending", // Default status
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "pay_now" ? "pending" : "not_required",
      paymentId: paymentMethod === "pay_now" ? null : undefined,
    });

    await newAppointment.save();

    // Send confirmation email to the user
    const subject = "📅 Appointment Request Received";
    const html = `
          <p>Dear ${user.fullName},</p>
          <p>We have received your appointment request with Dr. ${doctor.fullName} for ${date} at ${startTime}.</p>
          <p>Your appointment is currently pending confirmation. You will receive an official confirmation soon.</p>
          <p>If you have any questions or need to modify your appointment, please don't hesitate to reach out to us.</p>
          <p>Best regards,<br><strong>Your Company Name</strong></p>
        `;
    await sendEmail(user.email, subject, html);

    // **Return appointmentId if payment is required**
    res.status(201).json(
      createResponse({
        isSuccess: true,
        statusCode: 201,
        message: "Appointment booked successfully",
        data: {
          appointmentId: newAppointment._id,
          paymentRequired: paymentMethod === "pay_now" ? true : false,
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
    if (!["confirmed", "canceled"].includes(status)) {
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

    // Update appointment status
    appointment.status = status;
    if (status === "canceled") {
      appointment.rejectionReason = rejectionReason || "No reason provided";
    }

    await appointment.save();

    // Notify the user via email
    const user = await userModel.findById(appointment.user);
    const doctor = await doctorModel.findById(appointment.doctor);

    let subject = "";
    let html = "";

    if (status === "confirmed") {
      subject = "✅ Appointment Confirmed";
      html = `<p>Dear ${user.name},</p>
              <p>Your appointment with Dr. ${doctor.name} on ${appointment.date} at ${appointment.startTime} has been confirmed.</p>
              <p>Thank you for using our service!</p>`;
    } else {
      subject = "❌ Appointment Canceled";
      html = `<p>Dear ${user.name},</p>
              <p>Unfortunately, your appointment with Dr. ${doctor.name} on ${appointment.date} has been canceled.</p>
              <p>Reason: ${appointment.rejectionReason}</p>`;
    }

    await sendEmail(user.email, subject, html);

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
