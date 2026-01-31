// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import api from "../api";

// export const confirmRegisterforPickup = createAsyncThunk(
//     "partner/confirmRegisterForPickup",
//     async ({ carId }, { rejectWithValue }) => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await api.post(
//                 "/v1/partner/car-package-bookings/register",
//                 {}, // no body
//                 {
//                     params: {
//                         carId, // 👈 query param
//                     },
//                     headers: {
//                         Authorization: `Bearer ${token}`, // 👈 bearer token
//                     },
//                 }
//             );

//             return {
//                 data: response.data,
//                 status: response.status,
//             };
//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data || { message: "Confirm failed" }
//             );
//         }
//     }
// );
// export const updateStatus = createAsyncThunk(
//     "partner/updateStatus",
//     async ({ carId, status }, { rejectWithValue }) => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await api.patch(
//                 "/v1/partner/car-package-bookings/update-status",
//                 {}, // no body
//                 {
//                     params: {
//                         carId,
//                         status
//                     },
//                     headers: {
//                         Authorization: `Bearer ${token}`, // 👈 bearer token
//                     },
//                 }
//             );

//             return {
//                 data: response.data,
//                 status: response.status,
//             };
//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data || { message: "Confirm failed" }
//             );
//         }
//     }
// );
// export const updateLocation = createAsyncThunk(
//     "partner/updateLocation",
//     async ({ carId, status }, { rejectWithValue }) => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await api.patch(
//                 "/v1/partner/car-package-bookings/update-location",
//                 {}, // no body
//                 {
//                     params: {
//                         carId,
//                         latitude,
//                         longitude
//                     },
//                     headers: {
//                         Authorization: `Bearer ${token}`, // 👈 bearer token
//                     },
//                 }
//             );

//             return {
//                 data: response.data,
//                 status: response.status,
//             };
//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data || { message: "Confirm failed" }
//             );
//         }
//     }
// );
// export const getCurrentBooking = createAsyncThunk(
//     "partner/getCurrentBooking",
//     async ({ carId }, { rejectWithValue }) => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await api.get(
//                 "/v1/partner/car-package-bookings/get-current-booking",
//                 {
//                     params: {
//                         carId
//                     },
//                     headers: {
//                         Authorization: `Bearer ${token}`, // 👈 bearer token
//                         "ngrok-skip-browser-warning": "xyz",
//                     },
//                 }
//             );

//             return {
//                 data: response.data,
//                 status: response.status,
//             };
//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data || { message: "Confirm failed" }
//             );
//         }
//     }
// );


// const initialState = {
//     loading: false,
//     success: false,
//     data: null,
//     error: null,
// };

// const confirmBookingSlice = createSlice({
//     name: "confirmBooking",
//     initialState,
//     reducers: {
//         resetConfirmRegisterforPickup: (state) => {
//             state.loading = false;
//             state.success = false;
//             state.data = null;
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(confirmRegisterforPickup.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//                 state.success = false;
//             })
//             .addCase(confirmRegisterforPickup.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.success = true;
//                 state.data = action.payload.data;
//             })
//             .addCase(confirmRegisterforPickup.rejected, (state, action) => {
//                 state.loading = false;
//                 state.success = false;
//                 state.error = action.payload || action.error;
//             });
//     },
// });

// export const { resetConfirmRegisterforPickup } = confirmBookingSlice.actions;

// export default confirmBookingSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

/* ===================== THUNKS ===================== */

export const confirmRegisterforPickup = createAsyncThunk(
    "partner/confirmRegisterForPickup",
    async ({ carId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                "/v1/partner/car-package-bookings/register",
                {},
                {
                    params: { carId },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Confirm pickup failed" }
            );
        }
    }
);

export const updateStatus = createAsyncThunk(
    "partner/updateStatus",
    async ({ carId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.patch(
                "/v1/partner/car-package-bookings/update-status",
                {},
                {
                    params: { carId, status },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Update status failed" }
            );
        }
    }
);

//   useEffect(() => {
//         const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//         if (!isMobile) {
//           navigate("/", { replace: true });
//         }
//       }, [navigate]);

export const updateLocation = createAsyncThunk(
    "partner/updateLocation",
    async ({ carId, latitude, longitude }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.patch(
                "/v1/partner/car-package-bookings/update-location",
                {},
                {
                    params: { carId, latitude, longitude },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Update location failed" }
            );
        }
    }
);

export const getCurrentBooking = createAsyncThunk(
    "partner/getCurrentBooking",
    async ({ carId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/v1/partner/car-package-bookings/get-current-booking",
                {
                    params: { carId },
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
export const finishTrip = createAsyncThunk(
    "partner/finishTrip",
    async ({ carId, tripId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.patch(
                "/v1/partner/car-package-bookings/finish-trip",
                {},
                {
                    params: { carId, tripId },
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

/* ===================== INITIAL STATE ===================== */

const initialState = {
    /* ---- EXISTING (DO NOT TOUCH) ---- */
    loading: false,
    success: false,
    data: null,
    error: null,

    /* ---- UPDATE STATUS ---- */
    updateStatusLoading: false,
    updateStatusSuccess: false,
    updateStatusData: null,
    updateStatusError: null,

    /* ---- UPDATE LOCATION ---- */
    updateLocationLoading: false,
    updateLocationSuccess: false,
    updateLocationData: null,
    updateLocationError: null,

    /* ---- CURRENT BOOKING ---- */
    currentBookingLoading: false,
    currentBookingSuccess: false,
    currentBookingData: null,
    currentBookingError: null,

    /* ---- FINISH TRIP ---- */
    finishTripLoading: false,
    finishTripSuccess: false,
    finishTripError: null

};

/* ===================== SLICE ===================== */

const confirmBookingSlice = createSlice({
    name: "confirmBooking",
    initialState,
    reducers: {
        /* 🚫 DO NOT CHANGE */
        resetConfirmRegisterforPickup: (state) => {
            state.loading = false;
            state.success = false;
            state.data = null;
            state.error = null;
        },

        /* ✅ Independent resets */
        resetUpdateStatus: (state) => {
            state.updateStatusLoading = false;
            state.updateStatusSuccess = false;
            state.updateStatusData = null;
            state.updateStatusError = null;
        },

        resetUpdateLocation: (state) => {
            state.updateLocationLoading = false;
            state.updateLocationSuccess = false;
            state.updateLocationData = null;
            state.updateLocationError = null;
        },

        resetCurrentBooking: (state) => {
            state.currentBookingLoading = false;
            state.currentBookingSuccess = false;
            state.currentBookingData = null;
            state.currentBookingError = null;
        },

        resetFinishTrip: (state) => {
            state.finishTripLoading = false;
            state.finishTripSuccess = false;
            state.finishTripError = null
        }
    },
    extraReducers: (builder) => {
        builder

            /* -------- Confirm Register Pickup -------- */
            .addCase(confirmRegisterforPickup.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(confirmRegisterforPickup.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
            })
            .addCase(confirmRegisterforPickup.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            /* -------- Update Status -------- */
            .addCase(updateStatus.pending, (state) => {
                state.updateStatusLoading = true;
                state.updateStatusError = null;
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                state.updateStatusLoading = false;
                state.updateStatusSuccess = true;
                // state.updateStatusData = action.payload;
            })
            .addCase(updateStatus.rejected, (state, action) => {
                state.updateStatusLoading = false;
                state.updateStatusError = action.payload;
            })

            /* -------- Update Location -------- */
            .addCase(updateLocation.pending, (state) => {
                state.updateLocationLoading = true;
                state.updateLocationError = null;
            })
            .addCase(updateLocation.fulfilled, (state, action) => {
                state.updateLocationLoading = false;
                state.updateLocationSuccess = true;
                state.updateLocationData = action.payload;
            })
            .addCase(updateLocation.rejected, (state, action) => {
                state.updateLocationLoading = false;
                state.updateLocationError = action.payload;
            })

            /* -------- Get Current Booking -------- */
            .addCase(getCurrentBooking.pending, (state) => {
                state.currentBookingLoading = true;
                state.currentBookingError = null;
            })
            .addCase(getCurrentBooking.fulfilled, (state, action) => {
                state.currentBookingLoading = false;
                state.currentBookingSuccess = true;
                state.currentBookingData = action.payload;
            })
            .addCase(getCurrentBooking.rejected, (state, action) => {
                state.currentBookingLoading = false;
                state.currentBookingError = action.payload;
            })

            /* -------- Finish Trip -------- */
            .addCase(finishTrip.pending, (state) => {
                state.finishTripLoading = true;
                state.finishTripError = null;
            })
            .addCase(finishTrip.fulfilled, (state) => {
                state.finishTripLoading = false;
                state.finishTripSuccess = true;
            })
            .addCase(finishTrip.rejected, (state, action) => {
                state.finishTripLoading = false;
                state.finishTripError = action.payload;
            });
    },
});

/* ===================== EXPORTS ===================== */

export const {
    resetConfirmRegisterforPickup,
    resetUpdateStatus,
    resetUpdateLocation,
    resetCurrentBooking,
    resetFinishTrip
} = confirmBookingSlice.actions;

export default confirmBookingSlice.reducer;
