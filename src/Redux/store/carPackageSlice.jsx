import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Async thunk - Get Destinations
export const getDestinations = createAsyncThunk(
    "public/get-destinations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/v1/public/get-destinations`, {
                headers: {
                    "ngrok-skip-browser-warning": "xyz",
                },
            });
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Destinations fetch failed"
            );
        }
    }
);

// Async thunk - Get Packages
export const getPackages = createAsyncThunk(
    "public/get-packages",
    async ({ area, month }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/v1/public/search/car-package`, {
                params: { area, month },
                headers: {
                    "ngrok-skip-browser-warning": "xyz",
                },
            });
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Packages fetch failed"
            );
        }
    }
);

// Slice
const carPackageSlice = createSlice({
    name: "carPackage",
    initialState: {
        // destinations state
        destinations: [],
        destinationloading: false,
        destinationerror: null,
        destinationstatus: null,

        // packages state
        packages: [],
        packagesLoading: false,
        packagesError: null,
        packagesStatus: null,
    },
    reducers: {
        clearDestinations: (state) => {
            state.destinations = [];
            state.destinationerror = null;
            state.destinationstatus = null;
        },
        clearPackages: (state) => {
            state.packages = [];
            state.packagesError = null;
            state.packagesStatus = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Destinations cases
            .addCase(getDestinations.pending, (state) => {
                state.destinationloading = true;
                state.destinationerror = null;
            })
            .addCase(getDestinations.fulfilled, (state, action) => {
                state.destinationloading = false;
                state.destinations = action.payload.data;
                state.destinationstatus = action.payload.status;
            })
            .addCase(getDestinations.rejected, (state, action) => {
                state.destinationloading = false;
                state.destinationerror = action.payload;
            })

            // Packages cases
            .addCase(getPackages.pending, (state) => {
                state.packagesLoading = true;
                state.packagesError = null;
            })
            .addCase(getPackages.fulfilled, (state, action) => {
                state.packagesLoading = false;
                state.packages = action.payload.data;
                state.packagesStatus = action.payload.status;
            })
            .addCase(getPackages.rejected, (state, action) => {
                state.packagesLoading = false;
                state.packagesError = action.payload;
            });
    },
});

export const { clearDestinations, clearPackages } = carPackageSlice.actions;
export default carPackageSlice.reducer;