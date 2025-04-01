import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../../services/payment/payment.service";
import createApiResponse from "../../utils/createApiResponse";

// **Initiate Payment Thunk**
export const initiatePayment = createAsyncThunk(
  "payment/initiatePayment",
  async ({ userId, bookingId, amount, bookingType }, { rejectWithValue }) => {
    try {
      const response = await paymentService.initiatePaymentService({
        userId,
        bookingId,
        amount,
        bookingType,
      });
      console.log("The response from initiate payment slice is", response);
      if (!response.isSuccess) throw response;
      return response.data;
    } catch (error) {
      return rejectWithValue(
        createApiResponse(error, "Failed to initiate payment")
      );
    }
  }
);

// **Complete Payment Thunk**
export const completePayment = createAsyncThunk(
  "payment/completePayment",
  async (
    { pidx, transaction_id, amount, purchase_order_id },
    { rejectWithValue }
  ) => {
    try {
      // Call the complete payment service to verify the payment
      const response = await paymentService.completePaymentService({
        pidx,
        transaction_id,
        amount,
        purchase_order_id,
      });
      console.log("The response from complete  payment slice is", response);

      // If the response is not successful, throw an error with response data
      if (!response.isSuccess) {
        throw new Error(response.message || "Payment verification failed");
      }

      // Return the successful payment data if verification passed
      return response.data;
    } catch (error) {
      // Return an error response using rejectWithValue
      return rejectWithValue({
        isSuccess: false,
        message: error.message || "An error occurred while completing payment",
        error: error.response?.data || error.message,
      });
    }
  }
);


const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payment: null, 
    transactionDetails: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.payment = null;
      state.transactionDetails = null;
      state.isLoading = false;
      state.error = null;
    },
    setTransactionDetails: (state, action) => {
      state.transactionDetails = action.payload; 
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      // Initiate Payment
      .addCase(initiatePayment.pending, handlePending)
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payment = action.payload;
        state.error = null;
      })
      .addCase(initiatePayment.rejected, handleRejected)

      // Complete Payment
      .addCase(completePayment.pending, handlePending)
      .addCase(completePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payment = action.payload;
        state.transactionDetails = {
          transactionId: action.payload.transaction_id,
          amount: action.payload.amount,
          date: new Date().toLocaleString(),
          paymentMethod: "Khalti Wallet", // You can dynamically set this based on the payment method
          merchantName: "Med Connect", // Replace with your business name
        };
        state.error = null;
      })
      .addCase(completePayment.rejected, handleRejected);
  },
});

export const { resetPaymentState, setTransactionDetails } =
  paymentSlice.actions;
export default paymentSlice.reducer;
