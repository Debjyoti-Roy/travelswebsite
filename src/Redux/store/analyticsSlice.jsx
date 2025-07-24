import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
// update path if needed

// 1. Booking Summary
export const fetchBookingSummary = createAsyncThunk(
  "analytics/fetchBookingSummary",
  async ({ token, id, from, to }, thunkAPI) => {
    const response = await api.get(
      `/v1/partner/analytics/${id}/booking-summary?from=${from}&to=${to}`,
      {
        headers: { Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz", // optional if needed
    },
      }
    );
    return response.data;
  }
);

// 2. Earning Summary
export const fetchEarningSummary = createAsyncThunk(
  "analytics/fetchEarningSummary",
  async ({ token, id, from, to }, thunkAPI) => {
    const response = await api.get(
      `/v1/partner/analytics/${id}/earning-summary?from=${from}&to=${to}`,
      {
        headers: { Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz", // optional if needed
    },
      }
    );
    return response.data;
  }
);

// 3. Earnings by Month
export const fetchEarningsByMonth = createAsyncThunk(
  "analytics/fetchEarningsByMonth",
  async ({ token, id, year }, thunkAPI) => {
    const response = await api.get(
      `/v1/partner/analytics/${id}/earnings-by-month?year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz", // optional if needed
    },
      }
    );
    return response.data;
  }
);

// 4. Recent Bookings
export const fetchRecentBookings = createAsyncThunk(
  "analytics/fetchRecentBookings",
  async ({ token, id, days }, thunkAPI) => {
    const response = await api.get(
      `/v1/partner/analytics/${id}/recent-bookings?days=${days}`,
      {
        headers: { Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz", // optional if needed
    },
      }
    );
    return response.data;
  }
);

// 5. Today’s Check-ins
export const fetchTodayCheckins = createAsyncThunk(
  "analytics/fetchTodayCheckins",
  async ({ token, id, date }, thunkAPI) => {
    const response = await api.get(
      `/v1/partner/analytics/${id}/today-checkins`,
      // `/v1/partner/analytics/${id}/today-checkins?date=${date}`,
      {
        headers: { Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz", // optional if needed
    },
      }
    );
    return response.data;
  }
);

//6. Booking Analytics
export const fetchBookingAnalytics = createAsyncThunk(
  "analytics/fetchBookingAnalytics",
  async ({ token, bookingCode }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/v1/partner/analytics/search/booking?bookingCode=${bookingCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "xyz",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch analytics"
      );
    }
  }
);

const analyticsSlice = createSlice({
    name: "analytics",
    initialState: {
      bookingSummary: null,
      earningSummary: null,
      earningsByMonth: null,
      recentBookings: null,
      todayCheckins: null,
      bookingAnalytics: null,
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchBookingSummary.fulfilled, (state, action) => {
          state.bookingSummary = action.payload;
        })
        .addCase(fetchEarningSummary.fulfilled, (state, action) => {
          state.earningSummary = action.payload;
        })
        .addCase(fetchEarningsByMonth.fulfilled, (state, action) => {
          state.earningsByMonth = action.payload;
        })
        .addCase(fetchRecentBookings.fulfilled, (state, action) => {
          state.recentBookings = action.payload;
        })
        .addCase(fetchTodayCheckins.fulfilled, (state, action) => {
          state.todayCheckins = action.payload;
        })
        .addCase(fetchBookingAnalytics.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBookingAnalytics.fulfilled, (state, action) => {
          state.loading = false;
          state.bookingAnalytics = action.payload;
        })
        .addCase(fetchBookingAnalytics.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        })
        // handle loading and error (optional but recommended)
        .addMatcher(
          (action) => action.type.endsWith("/pending"),
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )
        .addMatcher(
          (action) => action.type.endsWith("/fulfilled"),
          (state) => {
            state.loading = false;
          }
        )
        .addMatcher(
          (action) => action.type.endsWith("/rejected"),
          (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          }
        );
    },
  });
  
  export default analyticsSlice.reducer;
  
