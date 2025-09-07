import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const countAwaiting = createAsyncThunk(
  "hotel/count-awaiting",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/v1/private/bookings/poll/count-awaiting`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "xyz",
        },
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Refund status fetch failed"
      );
    }
  }
);

export const getAwaiting = createAsyncThunk(
  "admin/get-awaiting",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/v1/private/bookings/poll/get-awaiting`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "xyz",
        },
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Refund status fetch failed"
      );
    }
  }
);

export const confirmBooking = createAsyncThunk(
  "admin/confirmBooking",
  async ({ bookingId }, { rejectWithValue }) => {
    
    const token = localStorage.getItem("token"); // ✅ added this
    try {
      const response = await api.post(
        `/v1/private/bookings/${bookingId}/confirm`,
        {}, // no body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Confirm failed" }
      );
    }
  }
);
export const cancelBooking = createAsyncThunk(
  "admin/cancelBooking",
  async ({ bookingId, reasonforCancel }, { rejectWithValue }) => {
    const token = localStorage.getItem("token"); // ✅ added this
    try {
      const response = await api.post(
        `/v1/private/bookings/${bookingId}/cancel?reason=${reasonforCancel}`,
        {}, // no body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Cancel failed" }
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    awaitingCount: 0,
    awaitingData: [],
    loading: false,
    error: null,
    confirmLoading: false,
    confirmSuccess: null,
    cancelLoading: false,
    cancelSuccess: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAwaitingCount: (state) => {
      state.awaitingCount = 0;
    },
    resetAwaitingData: (state) => {
      state.awaitingData = [];
    },
    resetConfirmStatus: (state) => {
      state.confirmSuccess = null;
      state.confirmLoading = false;
    },
    resetCancelStatus: (state) => {
      state.cancelSuccess = null;
      state.cancelLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // countAwaiting
      .addCase(countAwaiting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(countAwaiting.fulfilled, (state, action) => {
        state.loading = false;
        state.awaitingCount = action.payload.data;
        state.error = null;
      })
      .addCase(countAwaiting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch awaiting count";
      })

      // getAwaiting
      .addCase(getAwaiting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAwaiting.fulfilled, (state, action) => {
        state.loading = false;
        state.awaitingData = action.payload.data;
        state.error = null;
      })
      .addCase(getAwaiting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch awaiting data";
      })

      // confirmBooking
      .addCase(confirmBooking.pending, (state) => {
        state.confirmLoading = true;
        state.confirmSuccess = null;
        state.error = null;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.confirmLoading = false;
        state.confirmSuccess = true;

        // Optimistically update local state by removing confirmed booking
        state.awaitingData = state.awaitingData.filter(
          (b) => b.bookingId !== action.payload.bookingId
        );
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.confirmLoading = false;
        state.confirmSuccess = false;
        state.error = action.payload || "Failed to confirm booking";
      })
      

      .addCase(cancelBooking.pending, (state) => {
        state.cancelLoading = true;
        state.cancelSuccess = null;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.cancelSuccess = true;

        // Optimistically update local state by removing confirmed booking
        state.awaitingData = state.awaitingData.filter(
          (b) => b.bookingId !== action.payload.bookingId
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelLoading = false;
        state.cancelSuccess = false;
        state.error = action.payload || "Failed to cancel booking";
      });
  },
});

export const {
  clearError,
  resetAwaitingCount,
  resetAwaitingData,
  resetConfirmStatus,
} = adminSlice.actions;
export default adminSlice.reducer;
