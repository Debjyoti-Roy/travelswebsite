import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { api3 } from "../api";

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
    async ({ area, month, duration, catTypes }, { rejectWithValue }) => {
        try {
            // base mandatory params
            const params = {
                area,
                //   duration,
                month,
            };

            // only add carTypes if length > 0
            if (Array.isArray(catTypes) && catTypes.length > 0) {
                params.carTypes = catTypes.map((type) =>
                    type.replace(/\s+/g, "_")
                );
            }
            const d = Number(duration);
            if (!isNaN(d) && d >= 1) {
                params.duration = d;
            }

            const response = await api3.get(`/v1/public/search/car-package`, {
                params,
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

export const getCarDetails = createAsyncThunk(
    "public/getCarPackages",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/v1/public/${id}/car-package/details`, {
                headers: {
                    "ngrok-skip-browser-warning": "xyz",
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

        // car details state
        carDetails: null,
        carDetailsLoading: false,
        carDetailsError: null,
        carDetailsStatus: null,
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
            })

            // Car Details cases
            .addCase(getCarDetails.pending, (state) => {
                state.carDetailsLoading = true;
                state.carDetailsError = null;
            })
            .addCase(getCarDetails.fulfilled, (state, action) => {
                state.carDetailsLoading = false;
                state.carDetails = action.payload.data;
                state.carDetailsStatus = action.payload.status;
            })
            .addCase(getCarDetails.rejected, (state, action) => {
                state.carDetailsLoading = false;
                state.carDetailsError = action.payload;
            });
    },
});

export const { clearDestinations, clearPackages } = carPackageSlice.actions;
export default carPackageSlice.reducer;