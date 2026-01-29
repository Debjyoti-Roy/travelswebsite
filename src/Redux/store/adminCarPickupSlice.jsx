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

const initialState = {
    pickupBookings: [],
    getPickupBookingsLoading: false,
    getPickupBookingsError: null,
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
    },
    extraReducers: (builder) => {
        builder
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
            });
    },
});

export const {
    resetGetPickupBookingsState,
} = pickupBookingsSlice.actions;

export default pickupBookingsSlice.reducer;