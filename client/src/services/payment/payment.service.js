import axiosInstance from "../../utils/axiosInstance";
import createApiResponse from "../../utils/createApiResponse";

/**
 * Initiate Payment
 */
const initiatePaymentService = async ({
  userId,
  bookingId,
  amount,
  bookingType,
}) => {
  try {
    const response = await axiosInstance.post(
      "/api/payments/initiate-payment",
      {
        userId,
        bookingId,
        amount,
        bookingType,
      }
    );

    console.log("Response from payment initiation:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to initiate payment",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to initiate payment",
      error: error.message,
    });
  }
};

/**
 * Complete Payment Verification
 */
const completePaymentService = async ({
  pidx,
  transaction_id,
  amount,
  purchase_order_id,
}) => {
  try {
    const response = await axiosInstance.get(
      "/api/payments/complete-khalti-payment",
      {
        params: {
          pidx,
          transaction_id,
          amount,
          purchase_order_id,
        },
      }
    );

    console.log("Response from payment completion:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Payment verification failed",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

const getUserPaymentsService = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/payments/user-payments", {
      params,
    });

    console.log("Response from fetching user payments:", response);

    if (!response?.data?.isSuccess) {
      throw createApiResponse({
        isSuccess: false,
        message: response?.data?.message || "Failed to fetch user payments",
        error: response?.data?.error || null,
      });
    }

    return createApiResponse({
      isSuccess: true,
      data: response.data.data,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return createApiResponse({
      isSuccess: false,
      message: "Failed to fetch user payments",
      error: error.message,
    });
  }
};

const paymentService = {
  initiatePaymentService,
  completePaymentService,
  getUserPaymentsService,
};

export default paymentService;
