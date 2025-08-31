// src/redux/slices/stateSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // ✅ using your api instance

// Thunk for fetching states
export const getStates = createAsyncThunk(
    "public/get-states",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/v1/public/get-states`, {
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
                error.response?.data || "States fetch failed"
            );
        }
    }
);
export const getCarPackageDetails = createAsyncThunk(
    "public/get-car-package-details",
    async ({id}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/v1/public/${id}/car-package/details`, {
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
                error.response?.data || "States fetch failed"
            );
        }
    }
);

// ✅ Thunk for adding car package
export const addCarPackage = createAsyncThunk(
    "partner/add-car-package",
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.post(`/v1/partner/car-package/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "xyz",
                    "Content-Type": "application/json",
                },
            });
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Car package add failed"
            );
        }
    }
);
// ✅ Correct thunk
export const changeCarPackageStatus = createAsyncThunk(
    "partner/change-car-package-status",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.patch(
                `/v1/partner/car-package/status/${id}`, {}, {
                params: { status }, // request body

                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "xyz",
                    "Content-Type": "application/json",
                },
            }
            );
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Car package status update failed");
        }
    }
);


export const getAllCarPackages = createAsyncThunk(
    "partner/get-all-car-packages",
    async ({ page = 0, size = 10 }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/v1/partner/car-package/get-all`, {
                params: { page, size }, // ✅ pass query params
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
                error.response?.data || "Car package fetch failed"
            );
        }
    }
);



const adminCarSlice = createSlice({
    name: "adminCar",
    initialState: {
        states: [],
        statesloading: false,
        stateserror: null,
        loading: false,
        error: null,
        loading2: false,
        error2: null,
        carPackageResponse: null, // ✅ response of addCarPackage
        carPackages: [],          // ✅ list of packages
        carPackageDetails: null,  // ✅ details of a single package
        pagination: {             // ✅ pagination info
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getStates
            .addCase(getStates.pending, (state) => {
                state.statesloading = true;
                state.stateserror = null;
            })
            .addCase(getStates.fulfilled, (state, action) => {
                state.statesloading = false;
                state.states = action.payload.data;
            })
            .addCase(getStates.rejected, (state, action) => {
                state.statesloading = false;
                state.stateserror = action.payload;
            })

            // addCarPackage
            .addCase(addCarPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.carPackageResponse = null;
            })
            .addCase(addCarPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.carPackageResponse = action.payload.data;
            })
            .addCase(addCarPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllCarPackages
            .addCase(getAllCarPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCarPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.carPackages = action.payload.data.content;
                state.pagination = {
                    pageNumber: action.payload.data.pageNumber,
                    pageSize: action.payload.data.pageSize,
                    totalElements: action.payload.data.totalElements,
                    totalPages: action.payload.data.totalPages,
                    last: action.payload.data.last,
                };
            })
            .addCase(getAllCarPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // changeCarPackageStatus
            .addCase(changeCarPackageStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeCarPackageStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedId = action.payload.id;
                const updatedPkgIndex = state.carPackages.findIndex(
                    (pkg) => pkg.packageId === updatedId
                );
                if (updatedPkgIndex !== -1) {
                    state.carPackages[updatedPkgIndex].isActive =
                        !state.carPackages[updatedPkgIndex].isActive;
                }
            })
            .addCase(changeCarPackageStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ getCarPackageDetails
            .addCase(getCarPackageDetails.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.carPackageDetails = null;
            })
            .addCase(getCarPackageDetails.fulfilled, (state, action) => {
                state.loading2 = false;
                state.carPackageDetails = action.payload.data; // save package details
            })
            .addCase(getCarPackageDetails.rejected, (state, action) => {
                state.loading2 = false;
                state.error2 = action.payload;
            });
    },
});

export default adminCarSlice.reducer;

