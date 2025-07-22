import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const confirmPayment = createAsyncThunk(
  "payment/confirmPayment",
  async ({ token, razorpayPaymentId, razorpayOrderId, razorpaySignature }, thunkAPI) => {
    try {
      const response = await api.post(
        "/v1/private/hotel/confirm-payment",
        {
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => status === 200 || status === 409,
        }
      );
      console.log(response)
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


const initialState = {
  paymentStatus: null,
  paymentLoading: false,
  paymentError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.paymentStatus = null;
      state.paymentLoading = false;
      state.paymentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.paymentStatus = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
