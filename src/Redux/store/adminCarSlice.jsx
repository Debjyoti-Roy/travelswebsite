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
    async ({ id }, { rejectWithValue }) => {
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
export const updateCarPackage = createAsyncThunk(
    "partner/update-car-package",
    async ({ formData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.patch(`/v1/partner/car-package/update`, formData, {
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
export const deregisterCar = createAsyncThunk(
    "partner/deregister-car",
    async ({ carPackageId, carId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.patch(`/v1/partner/car-package/remove-car/${carPackageId}/${carId}`, {}, {
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
export const updateCarPrices = createAsyncThunk(
    "partner/update-car-price",
    async ({ formData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.put(`/v1/partner/car-package/update-price/${formData.packageId}/${formData.id}`, formData.prices, {
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
export const addCartoPackage = createAsyncThunk(
    "partner/add-car",
    async ({ formData, packageId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.put(`/v1/partner/car-package/add-car/${packageId}`, formData, {
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

export const carCountAwaiting = createAsyncThunk(
    "partner/count-awaiting",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            const response = await api.get(`/v1/private/car-package-bookings/poll/count-awaiting`, {
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
export const getCarAwaiting = createAsyncThunk(
    "partner/get-awaiting",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            const response = await api.get(`/v1/private/car-package-bookings/poll/get-awaiting`, {
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
    "partner/confirmBooking",
    async ({ bookingId, carId }, { rejectWithValue }) => {

        const token = localStorage.getItem("token"); // ✅ added this
        try {
            const response = await api.post(
                `/v1/private/car-package-bookings/${bookingId}/confirm`,
                {}, // no body
                {
                    params: { carId },
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
    "partner/cancelBooking",
    async ({ bookingId, reason }, { rejectWithValue }) => {

        const token = localStorage.getItem("token"); // ✅ added this
        try {
            const response = await api.post(
                `/v1/private/car-package-bookings/${bookingId}/cancel`,
                {},
                {
                    params: { reason },
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
export const searchCarBooking = createAsyncThunk(
    "partner/searchCarBooking",
    async ({ bookingId, page, size }, { rejectWithValue }) => {

        const token = localStorage.getItem("token"); // ✅ added this
        try {
            const response = await api.get(
                `/v1/private/car-package-bookings/${bookingId}/search-car`,
                {
                    params: { page, size },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "xyz",
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

        loading3: false,
        error3: null,

        loading4: false, // ✅ updateCarPrices
        error4: null,

        loading5: false, // ✅ addCar
        error5: null,

        loading6: false, // ✅ deregisterCar
        error6: null,

        carPackageResponse: null,
        updateResponse: null,
        updatePriceResponse: null,
        deregisterResponse: null,

        carPackages: [],
        carPackageDetails: null,

        carAwaitingCount: null,
        awaitingLoading: false,
        awaitingError: null,
        awaitingStatus: null,

        getAwaiting: [],
        getAwaitingLoading: false,
        getAwaitingError: null,
        getAwaitingStatus: null,

        confirmLoading: false,
        confirmSuccess: null,
        confirmerror: null,
        confirmstatus: null,

        cancelLoading: false,
        cancelSuccess: null,
        cancelerror: null,
        cancelstatus: null,


        pagination: {
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
        },

        // booking seach
        searchLoading: false,
        searchError: null,
        searchResults: [],
        searchPagination: {
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
            // ✅ getStates
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

            // ✅ addCarPackage
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

            // ✅ updateCarPackage
            .addCase(updateCarPackage.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.updateResponse = null;
            })
            .addCase(updateCarPackage.fulfilled, (state, action) => {
                state.loading3 = false;
                state.updateResponse = action.payload.data;

                const updatedPkg = action.payload.data;
                const idx = state.carPackages.findIndex(
                    (pkg) => pkg.packageId === updatedPkg.packageId
                );
                if (idx !== -1) {
                    state.carPackages[idx] = {
                        ...state.carPackages[idx],
                        ...updatedPkg,
                    };
                }
            })
            .addCase(updateCarPackage.rejected, (state, action) => {
                state.loading3 = false;
                state.error3 = action.payload;
            })

            // ✅ updateCarPrices
            .addCase(updateCarPrices.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.updatePriceResponse = null;
            })
            .addCase(updateCarPrices.fulfilled, (state, action) => {
                state.loading4 = false;
                state.updatePriceResponse = action.payload.data;

                const updatedPricePkg = action.payload.data;
                const idx = state.carPackages.findIndex(
                    (pkg) => pkg.packageId === updatedPricePkg.packageId
                );
                if (idx !== -1) {
                    state.carPackages[idx] = {
                        ...state.carPackages[idx],
                        ...updatedPricePkg,
                    };
                }
            })
            .addCase(updateCarPrices.rejected, (state, action) => {
                state.loading4 = false;
                state.error4 = action.payload;
            })

            // ✅ addCar
            .addCase(addCartoPackage.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
            })
            .addCase(addCartoPackage.fulfilled, (state, action) => {
                state.loading5 = false;
                const newCar = action.payload.data;

                if (state.carPackageDetails?.carDetails) {
                    state.carPackageDetails.carDetails.push(newCar);
                }

                const pkgIndex = state.carPackages.findIndex(
                    (pkg) => pkg.packageId === newCar.packageId
                );
                if (pkgIndex !== -1) {
                    state.carPackages[pkgIndex] = {
                        ...state.carPackages[pkgIndex],
                        carDetails: [
                            ...(state.carPackages[pkgIndex].carDetails || []),
                            newCar,
                        ],
                    };
                }
            })
            .addCase(addCartoPackage.rejected, (state, action) => {
                state.loading5 = false;
                state.error5 = action.payload;
            })

            // ✅ deregisterCar
            .addCase(deregisterCar.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.deregisterResponse = null;
            })
            .addCase(deregisterCar.fulfilled, (state, action) => {
                state.loading6 = false;
                state.deregisterResponse = action.payload.data;

                const { carId, packageId } = action.meta.arg;

                // update carPackageDetails
                if (state.carPackageDetails?.carDetails) {
                    state.carPackageDetails.carDetails =
                        state.carPackageDetails.carDetails.filter(
                            (car) => car.carId !== carId
                        );
                }

                // also update carPackages list
                const pkgIndex = state.carPackages.findIndex(
                    (pkg) => pkg.packageId === packageId
                );
                if (pkgIndex !== -1) {
                    state.carPackages[pkgIndex] = {
                        ...state.carPackages[pkgIndex],
                        carDetails: state.carPackages[pkgIndex].carDetails?.filter(
                            (car) => car.carId !== carId
                        ),
                    };
                }
            })
            .addCase(deregisterCar.rejected, (state, action) => {
                state.loading6 = false;
                state.error6 = action.payload;
            })

            // ✅ getAllCarPackages
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

            // ✅ changeCarPackageStatus
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
                state.carPackageDetails = action.payload.data;
            })
            .addCase(getCarPackageDetails.rejected, (state, action) => {
                state.loading2 = false;
                state.error2 = action.payload;
            })

            // ✅ countAwaiting
            .addCase(carCountAwaiting.pending, (state) => {
                state.awaitingLoading = true;
                state.awaitingError = null;
            })
            .addCase(carCountAwaiting.fulfilled, (state, action) => {
                state.awaitingLoading = false;
                state.carAwaitingCount = action.payload.data;
                state.awaitingStatus = action.payload.status;
            })
            .addCase(carCountAwaiting.rejected, (state, action) => {
                state.awaitingLoading = false;
                state.awaitingError = action.payload;
            })
            // get Awaiting
            .addCase(getCarAwaiting.pending, (state) => {
                state.getAwaitingLoading = true;
                state.getAwaitingError = null;
            })
            .addCase(getCarAwaiting.fulfilled, (state, action) => {
                state.getAwaitingLoading = false;
                state.getAwaiting = action.payload.data;
                // getAwaitingStatus = action.payload.status;
            })
            .addCase(getCarAwaiting.rejected, (state, action) => {
                state.getAwaitingLoading = false;
                state.getAwaitingError = action.payload;
            })
            // confirm booking
            .addCase(confirmBooking.pending, (state) => {
                state.confirmLoading = true;
                state.confirmerror = null;
            })
            .addCase(confirmBooking.fulfilled, (state, action) => {
                state.confirmLoading = false;
                state.confirmSuccess = action.payload.data;
                state.confirmstatus = action.payload.status;
            })
            .addCase(confirmBooking.rejected, (state, action) => {
                state.confirmLoading = false;
                state.confirmerror = action.payload;
            })
            // cancel booking
            .addCase(cancelBooking.pending, (state) => {
                state.cancelLoading = true;
                state.cancelerror = null;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.cancelLoading = false;
                state.cancelSuccess = action.payload.data;
                state.cancelstatus = action.payload.status;
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.cancelLoading = false;
                state.cancelerror = action.payload;
            })
            .addCase(searchCarBooking.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchCarBooking.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload.data.content || []; // assuming paged response
                state.searchPagination = {
                    pageNumber: action.payload.data.pageNumber,
                    pageSize: action.payload.data.pageSize,
                    totalElements: action.payload.data.totalElements,
                    totalPages: action.payload.data.totalPages,
                    last: action.payload.data.last,
                };
            })
            .addCase(searchCarBooking.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.payload;
            });

    },
});

export default adminCarSlice.reducer;