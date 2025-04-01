import createResponse from "../../utils/responseBuilder.js";
import appointmentModel from "../../models/appointment.model.js";
import paymentModel from "../../models/payment.model.js";
import userModel from "../../models/user.model.js";
import axios from "axios";
import appConfig from "../../config/appConfig.js";
import TestBooking from "../../models/testBooking.model.js";

export const initiatePayment = async (req, res) => {
  const { userId, bookingId, amount, bookingType } = req.body;
  console.log("Received payment initiation request:", req.body);

  try {
    // Validate required fields
    if (!userId || !bookingId || !amount || !bookingType) {
      console.log("Validation error: Missing required fields");
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: "Missing required fields",
        })
      );
    }

    // Validate booking type
    if (!["appointment", "medical_test"].includes(bookingType)) {
      console.log("Validation error: Invalid booking type", bookingType);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message:
            "Invalid booking type. Must be either 'appointment' or 'medical_test'",
        })
      );
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    console.log("userModel lookup result:", user);
    if (!user) {
      console.log(`userModel not found for ID: ${userId}`);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "userModel not found",
        })
      );
    }

    // Check if booking exists based on type
    let booking;
    if (bookingType === "appointment") {
      booking = await appointmentModel.findById(bookingId);
    } else if (bookingType === "medical_test") {
      booking = await TestBooking.findById(bookingId);

      // Additional validation for medical test if needed
      if (booking && booking.paymentMethod === "pay_on_site") {
        console.log(
          "Medical test is marked for pay on site, no online payment needed"
        );
        return res.status(400).json(
          createResponse({
            isSuccess: false,
            statusCode: 400,
            message: "This medical test is marked for payment at hospital",
          })
        );
      }
    }

    console.log(`Booking lookup result for type "${bookingType}":`, booking);
    if (!booking) {
      console.log(`${bookingType} not found for ID: ${bookingId}`);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: `${bookingType} not found`,
        })
      );
    }

    // Check if booking is already paid
    if (booking.paymentStatus === "paid") {
      console.log(`${bookingType} is already paid`);
      return res.status(400).json(
        createResponse({
          isSuccess: false,
          statusCode: 400,
          message: `${bookingType} is already paid`,
        })
      );
    }

    // Create payment record
    const newPayment = await paymentModel.create({
      userId,
      bookingId,
      bookingType,
      amount,
      paymentMethod: "khalti",
      paymentStatus: "pending",
    });

    console.log("New payment record created:", newPayment);

    // Prepare Khalti payment data
    const amountInPaisa = amount * 100;
    const paymentData = {
      return_url: `${appConfig.backend_url}/api/payments/complete-khalti-payment`,
      website_url: `${appConfig.frontend_url}`,
      amount: amountInPaisa,
      purchase_order_id: newPayment._id,
      purchase_order_name: `${bookingType} paymentModel`,
      customer_info: {
        name: user.fullName,
        email: user.email,
      },
    };

    console.log("Khalti payment data:", paymentData);

    // Initiate Khalti payment
    const headers = {
      Authorization: `Key ${appConfig.khalti_secret_key}`,
      "Content-Type": "application/json",
    };

    const paymentResponse = await axios.post(
      `${appConfig.khalti_url}/api/v2/epayment/initiate/`,
      paymentData,
      { headers }
    );

    console.log("Khalti API response:", paymentResponse.data);

    // Update booking with payment reference if needed
    if (bookingType === "appointment") {
      await appointmentModel.findByIdAndUpdate(bookingId, {
        paymentId: newPayment._id,
      });
    } else if (bookingType === "medical_test") {
      await TestBooking.findByIdAndUpdate(bookingId, {
        paymentId: newPayment._id,
      });
    }

    res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "paymentModel initiated successfully",
        data: paymentResponse.data,
      })
    );
  } catch (error) {
    console.error("Error initiating payment:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });

    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Failed to initiate payment",
        error: error.message,
      })
    );
  }
};

export const completeKhaltiPayment = async (req, res, next) => {
  const { pidx, transaction_id, amount, purchase_order_id } = req.query;
  console.log("Received payment completion request:", req.query);

  try {
    const headers = {
      Authorization: `Key ${appConfig.khalti_secret_key}`,
      "Content-Type": "application/json",
    };

    console.log("Verifying payment with Khalti using pidx:", pidx);

    const paymentVerifyResponse = await axios.post(
      `${appConfig.khalti_url}/api/v2/epayment/lookup/`,
      { pidx },
      { headers }
    );

    console.log("Khalti verification response:", paymentVerifyResponse.data);

    const paymentInfo = paymentVerifyResponse.data;
    if (!paymentInfo || paymentInfo.status !== "Completed") {
      console.log("paymentModel verification failed. Status:", paymentInfo?.status);

      // Update payment status to 'failed'
      await paymentModel.findByIdAndUpdate(purchase_order_id, {
        paymentStatus: "failed",
        failureReason: paymentInfo?.status || "Verification failed",
      });

      // Create query parameters with failure details
      const failureParams = new URLSearchParams({
        status: "failure",
        transaction_id: transaction_id || "",
        amount: amount || "",
        error: paymentInfo?.status || "Verification failed",
      }).toString();

      // Redirect to failure page with query parameters
      console.log(
        "Redirecting user to the payment failure page with details..."
      );
      return res.redirect(
        `${appConfig.frontend_url}/payment-failed?${failureParams}`
      );
    }

    console.log(
      "paymentModel verified successfully. paymentModel status is 'Completed'."
    );

    // Update payment record
    const updatedPayment = await paymentModel.findByIdAndUpdate(
      purchase_order_id,
      {
        transactionId: transaction_id,
        pidx: pidx,
        paymentStatus: "completed",
      },
      { new: true }
    );

    console.log("Updated payment record:", updatedPayment);

    // Update the relevant booking based on booking type
    if (updatedPayment.bookingId) {
      console.log(`Updating ${updatedPayment.bookingType} booking status...`);

      if (updatedPayment.bookingType === "appointment") {
        await appointmentModel.findByIdAndUpdate(updatedPayment.bookingId, {
          paymentStatus: "paid",
          status: "confirmed", // Optional: Update appointment status
        });
        console.log("appointmentModel marked as paid and confirmed.");
      } else if (updatedPayment.bookingType === "medical_test") {
        await TestBooking.findByIdAndUpdate(updatedPayment.bookingId, {
          paymentStatus: "paid",
          status: "confirmed", // Optional: Update test booking status
        });
        console.log("Medical test booking marked as paid and confirmed.");
      }

      // Send notification/email about successful payment
      // You can add this functionality here if needed
    }

    // Create query parameters with success details
    const successParams = new URLSearchParams({
      status: "success",
      transaction_id: transaction_id || "",
      amount: amount || "",
      purchase_order_id: purchase_order_id || "",
      pidx: pidx || "",
      booking_type: updatedPayment?.bookingType || "",
    }).toString();

    // Redirecting to success page with query parameters
    console.log("Redirecting user to the payment success page with details...");
    return res.redirect(
      `${appConfig.frontend_url}/payment-success?${successParams}`
    );
  } catch (error) {
    console.error("paymentModel completion error:", {
      message: error.message,
      stack: error.stack,
      queryParams: req.query,
    });

    // Update payment status to 'failed' if we have the purchase_order_id
    if (purchase_order_id) {
      await paymentModel.findByIdAndUpdate(purchase_order_id, {
        paymentStatus: "failed",
        failureReason: error.message.substring(0, 200), // Truncate long messages
      });
    }

    // Create query parameters with error details
    const errorParams = new URLSearchParams({
      status: "error",
      message:
        error.message || "Unknown error occurred during payment processing",
      purchase_order_id: purchase_order_id || "",
    }).toString();

    console.log(
      "Redirecting user to the payment failure page with error details..."
    );
    return res.redirect(
      `${appConfig.frontend_url}/payment-failed?${errorParams}`
    );
  }
};
