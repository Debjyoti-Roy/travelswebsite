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
export const assignCar = createAsyncThunk(
  "partner/assignCar",
  async ({ bookingId, carId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        "/v1/private/car-package-bookings/assign-car",
        {},
        {
          params: { bookingId, carId },
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "xyz",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Assign car failed" }
      );
    }
  }
);
export const cancelPickupCarBooking = createAsyncThunk(
  "partner/cancelPickupCarBooking",
  async ({ bookingId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.patch(
        "/v1/private/car-package-bookings/cancel-booking",
        {},
        {
          params: { bookingId },
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "xyz",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Assign car failed" }
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

  // assign car
  assignCarLoading: false,
  assignCarError: null,
  assignCarSuccess: false,

  // cancel pickup booking
  cancelPickupBookingLoading: false,
  cancelPickupBookingError: null,
  cancelPickupBookingSuccess: false,
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

    resetAssignCarState: (state) => {
      state.assignCarLoading = false;
      state.assignCarError = null;
      state.assignCarSuccess = false;
    },

    resetCancelPickupBookingState: (state) => {
      state.cancelPickupBookingLoading = false;
      state.cancelPickupBookingError = null;
      state.cancelPickupBookingSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ---------------- GET PICKUP BOOKINGS ----------------
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

      // ---------------- GET ALL CARS ----------------
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
      })

      // ---------------- ASSIGN CAR ----------------
      .addCase(assignCar.pending, (state) => {
        state.assignCarLoading = true;
        state.assignCarError = null;
        state.assignCarSuccess = false;
      })
      .addCase(assignCar.fulfilled, (state) => {
        state.assignCarLoading = false;
        state.assignCarSuccess = true;
      })
      .addCase(assignCar.rejected, (state, action) => {
        state.assignCarLoading = false;
        state.assignCarError =
          action.payload?.message || "Assign car failed";
      })

      // ---------------- CANCEL PICKUP BOOKING ----------------
      .addCase(cancelPickupCarBooking.pending, (state) => {
        state.cancelPickupBookingLoading = true;
        state.cancelPickupBookingError = null;
        state.cancelPickupBookingSuccess = false;
      })
      .addCase(cancelPickupCarBooking.fulfilled, (state) => {
        state.cancelPickupBookingLoading = false;
        state.cancelPickupBookingSuccess = true;
      })
      .addCase(cancelPickupCarBooking.rejected, (state, action) => {
        state.cancelPickupBookingLoading = false;
        state.cancelPickupBookingError =
          action.payload?.message || "Cancel pickup booking failed";
      });
  },
});

export const {
  resetGetPickupBookingsState,
  resetGetAllCarsState,
  resetAssignCarState,
  resetCancelPickupBookingState,
} = pickupBookingsSlice.actions;

export default pickupBookingsSlice.reducer;