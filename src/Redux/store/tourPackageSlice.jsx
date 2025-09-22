import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { api3 } from "../api";

export const getPackages = createAsyncThunk(
    "public/get-packages",
    async ({ area, month, duration, tourTypes }, { rejectWithValue }) => {
        try {
            // base mandatory params
            const params = {
                area,
                //   duration,
                month,
            };

            // only add carTypes if length > 0
            if (Array.isArray(tourTypes) && tourTypes.length > 0) {
                params.tourTypes = tourTypes.map((type) =>
                    type.replace(/\s+/g, "_")
                );
            }
            const d = Number(duration);
            if (!isNaN(d) && d >= 1) {
                params.duration = d;
            }

            const response = await api3.get(`/v1/public/tour-package/search`, {
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

export const getTourDetails = createAsyncThunk(
    "public/getTourPackage",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/v1/public/tour-package/get/${id}`, {
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

const initialState = {
    packages: [],
    loading: false,
    error: null,

    //details
    tourDetails: null,
    tourDetailsLoading: false,
    tourDetailsError: null,
    tourDetailsStatus: null,
};

const tourPackageSlice = createSlice({
    name: "packages",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload.data || [];
            })
            .addCase(getPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch packages";
            })
            // getTourDetails
            .addCase(getTourDetails.pending, (state) => {
                state.tourDetailsLoading = true;
                state.tourDetailsError = null;
                state.tourDetailsStatus = null;
            })
            .addCase(getTourDetails.fulfilled, (state, action) => {
                state.tourDetailsLoading = false;
                state.tourDetails = action.payload.data || null;
                state.tourDetailsStatus = action.payload.status;
            })
            .addCase(getTourDetails.rejected, (state, action) => {
                state.tourDetailsLoading = false;
                state.tourDetailsError = action.payload || "Failed to fetch tour details";
            });
    },
});

export default tourPackageSlice.reducer;