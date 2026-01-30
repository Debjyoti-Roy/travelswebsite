import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const getPickupBookings = createAsyncThunk(
  "partner/getCurrentBooking",
  async ({ status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/v1/private/car-package-bookings/get-bookings",
        {
          params: { status },
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "xyz",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Get current booking failed" }
      );
    }
  }
);

export const getAllCars = createAsyncThunk(
  "partner/getAllCars",
  async ({ capacity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/v1/private/car-package-bookings/get-all-car",
        {
          params: { capacity },
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "xyz",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Get all cars failed" }
      );
    }
  }
);

const initialState = {
  // pickup bookings
  pickupBookings: [],
  getPickupBookingsLoading: false,
  getPickupBookingsError: null,

  // cars
  cars: [],
  getAllCarsLoading: false,
  getAllCarsError: null,
};

const pickupBookingsSlice = createSlice({
  name: "pickupBookings",
  initialState,
  reducers: {
    resetGetPickupBookingsState: (state) => {
      state.pickupBookings = [];
      state.getPickupBookingsLoading = false;
      state.getPickupBookingsError = null;
    },

    resetGetAllCarsState: (state) => {
      state.cars = [];
      state.getAllCarsLoading = false;
      state.getAllCarsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getPickupBookings
      .addCase(getPickupBookings.pending, (state) => {
        state.getPickupBookingsLoading = true;
        state.getPickupBookingsError = null;
      })
      .addCase(getPickupBookings.fulfilled, (state, action) => {
        state.getPickupBookingsLoading = false;
        state.pickupBookings = action.payload;
      })
      .addCase(getPickupBookings.rejected, (state, action) => {
        state.getPickupBookingsLoading = false;
        state.getPickupBookingsError =
          action.payload?.message || "Failed to fetch pickup bookings";
      })

      // getAllCars
      .addCase(getAllCars.pending, (state) => {
        state.getAllCarsLoading = true;
        state.getAllCarsError = null;
      })
      .addCase(getAllCars.fulfilled, (state, action) => {
        state.getAllCarsLoading = false;
        state.cars = action.payload;
      })
      .addCase(getAllCars.rejected, (state, action) => {
        state.getAllCarsLoading = false;
        state.getAllCarsError =
          action.payload?.message || "Failed to fetch cars";
      });
  },
});

export const {
  resetGetPickupBookingsState,
  resetGetAllCarsState,
} = pickupBookingsSlice.actions;

export default pickupBookingsSlice.reducer;