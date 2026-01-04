import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const getPickupLocations = createAsyncThunk(
    "pickup/getPickupLocations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/v1/public/car-package-bookings/get-all-locations", {
                headers: {
                    "ngrok-skip-browser-warning": "xyz", // optional if needed
                },
            });
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
export const getPickupRoutes = createAsyncThunk(
    "pickup/getPickupRoutes",
    async ({ pickuplocation, dropuplocation, numberofpeople }, { rejectWithValue }) => {
        try {
            const params = {
                pickuplocation,
                dropuplocation,
                numberofpeople
            }
            const response = await api.get("/v1/public/car-package-bookings/get-pickup-route", {
                params,
                headers: {
                    "ngrok-skip-browser-warning": "xyz", // optional if needed
                },
            });
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

const initialState = {
    pickupLocations: [],
    pickupRoutes: [],
  
    loadingLocations: false,
    loadingRoutes: false,
  
    errorLocations: null,
    errorRoutes: null,
  };
  
  const pickupSlice = createSlice({
    name: "pickup",
    initialState,
    reducers: {
      clearPickupRoutes: (state) => {
        state.pickupRoutes = [];
        state.errorRoutes = null;
      },
    },
    extraReducers: (builder) => {
      builder
        /* ---------------- Pickup Locations ---------------- */
        .addCase(getPickupLocations.pending, (state) => {
          state.loadingLocations = true;
          state.errorLocations = null;
        })
        .addCase(getPickupLocations.fulfilled, (state, action) => {
          state.loadingLocations = false;
          state.pickupLocations = action.payload.data;
        })
        .addCase(getPickupLocations.rejected, (state, action) => {
          state.loadingLocations = false;
          state.errorLocations = action.payload || "Failed to fetch pickup locations";
        })
  
        /* ---------------- Pickup Routes ---------------- */
        .addCase(getPickupRoutes.pending, (state) => {
          state.loadingRoutes = true;
          state.errorRoutes = null;
        })
        .addCase(getPickupRoutes.fulfilled, (state, action) => {
          state.loadingRoutes = false;
          state.pickupRoutes = action.payload.data;
        })
        .addCase(getPickupRoutes.rejected, (state, action) => {
          state.loadingRoutes = false;
          state.errorRoutes = action.payload || "Failed to fetch pickup routes";
        });
    },
  });
  
  export const { clearPickupRoutes } = pickupSlice.actions;
  
  export default pickupSlice.reducer;
  