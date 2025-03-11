import createResponse from "../../utils/responseBuilder.js";
import appointmentModel from "../../models/appointment.model.js";
import paymentModel from "../../models/payment.model.js";
import userModel from "../../models/user.model.js";
import axios from "axios";
import appConfig from "../../config/appConfig.js";
import createError from "http-errors"; // For error handling

export const initiatePayment = async (req, res) => {
  const { userId, bookingId, amount, bookingType } = req.body;
  console.log("Received payment initiation request:", req.body);

  try {
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

    const user = await userModel.findById(userId);
    console.log("User lookup result:", user);

    if (!user) {
      console.log(`User not found for ID: ${userId}`);
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found",
        })
      );
    }

    let booking;
    if (bookingType === "appointment") {
      booking = await appointmentModel.findById(bookingId);
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

    const newPayment = await paymentModel.create({
      userId,
      bookingId,
      bookingType,
      amount,
      paymentMethod: "khalti",
      paymentStatus: "pending",
    });

    console.log("New payment record created:", newPayment);

    const amountInPaisa = amount * 100;
    const paymentData = {
      return_url: `${appConfig.backend_url}/api/payments/complete-khalti-payment`,
      website_url: `${appConfig.frontend_url}`,
      amount: amountInPaisa,
      purchase_order_id: newPayment._id,
      purchase_order_name: `${bookingType} Payment`,
      customer_info: {
        name: user.fullName,
        email: user.email,
      },
    };

    console.log("Khalti payment data:", paymentData);

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

    res.status(200).json({
      isSuccess: true,
      message: "Payment initiated successfully",
      payment: paymentResponse.data,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Failed to initiate payment",
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
      console.log("Payment verification failed. Status:", paymentInfo?.status);

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
        error: paymentInfo?.status || "Verification failed"
      }).toString();

      // Redirect to failure page with query parameters
      console.log("Redirecting user to the payment failure page with details...");
      return res.redirect(`${appConfig.frontend_url}/payment-failed?${failureParams}`);
    }

    console.log(
      "Payment verified successfully. Payment status is 'Completed'."
    );

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

    // If the payment is related to a booking, update its payment status
    if (updatedPayment.bookingId) {
      console.log("Booking ID found. Marking appointment as paid...");
      await appointmentModel.findByIdAndUpdate(updatedPayment.bookingId, {
        paymentStatus: "paid",
      });
      console.log("Appointment marked as paid.");
    }

    // Create query parameters with success details
    const successParams = new URLSearchParams({
      status: "success",
      transaction_id: transaction_id || "",
      amount: amount || "",
      purchase_order_id: purchase_order_id || "",
      pidx: pidx || ""
    }).toString();

    // Redirecting to success page with query parameters
    console.log("Redirecting user to the payment success page with details...");
    return res.redirect(`${appConfig.frontend_url}/payment-success?${successParams}`);
  } catch (error) {
    console.error("Payment completion error:", error);
    console.log(
      "Error occurred during payment verification or update process."
    );
    
    // Create query parameters with error details
    const errorParams = new URLSearchParams({
      status: "error",
      message: error.message || "Unknown error occurred during payment processing"
    }).toString();
    
    console.log("Redirecting user to the payment failure page with error details...");
    return res.redirect(`${appConfig.frontend_url}/payment-failed?${errorParams}`);
  }
};
