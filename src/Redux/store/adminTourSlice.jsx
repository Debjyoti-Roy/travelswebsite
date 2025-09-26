import api from "../api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addTourPackage = createAsyncThunk(
    "admin/add-tour-package",
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.post(`/v1/partner/tour-package/create`, formData, {
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

export const getTours = createAsyncThunk(
    "admin/getTours",
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/v1/partner/tour-package/get-all", {
                params: { page, size },
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
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const changeTourPackageStatus = createAsyncThunk(
    "admin/change-tour-package-status",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.patch(
                `/v1/partner/tour-package/status/${id}`, {}, {
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
export const getTourDetails = createAsyncThunk(
    "admin/getTourPackage",
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

export const tourCountAwaiting = createAsyncThunk(
    "partner/count-awaiting",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            const response = await api.get(`/v1/private/tour-package-bookings/poll/count-awaiting`, {
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
export const getTourAwaiting = createAsyncThunk(
    "partner/get-awaiting",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            const response = await api.get(`/v1/private/tour-package-bookings/poll/get-awaiting`, {
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
export const getTourAwaitingByStatus = createAsyncThunk(
    "partner/get-awaiting-by-status",
    async (queryStatus, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            const response = await api.get(`/v1/private/tour-package-bookings/get-bookings`, {
                params: { queryStatus },
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
export const changeTourAwaitingStatus = createAsyncThunk(
    "partner/change-awaiting-status",
    async ({ ticketId, queryStatus }, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            const response = await api.patch(
                `/v1/private/tour-package-bookings/change-status`,{},
                {
                    params: { ticketId, queryStatus },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "xyz",
                    },
                }
            );
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Change status failed"
            );
        }
    }
);


// const adminPackageSlice = createSlice({
//     name: "tourPackage",
//     initialState: {
//         data: null,
//         loading: false,
//         error: null,

//         // tours
//         tourData: [],
//         tourLoading: false,
//         tourError: null,
//         pagination: {
//             pageNumber: 0,
//             pageSize: 10,
//             totalElements: 0,
//             totalPages: 0,
//             last: true,
//         },

//         // status change
//         statusLoading: false,
//         statusError: null,
//         statusSuccess: false,

//         // details
//         tourDetails: null,
//         tourDetailsLoading: false,
//         tourDetailsError: null,
//         tourDetailsStatus: null,

//         // awaiting count
//         awaitingtourCount: 0,
//         awaitingtourCountLoading: false,
//         awaitingtourCountError: null,

//         //tourAwaiting
//         tourAwaiting: [],
//         tourAwaitingLoading: false,
//         tourAwaitingError: null,

//         //tourAwaitingBystatus
//         tourAwaitingByStatus: [],
//         tourAwaitingLoadingByStatus: false,
//         tourAwaitingErrorByStatus: null
//     },
//     extraReducers: (builder) => {
//         // --- addTourPackage ---
//         builder
//             .addCase(addTourPackage.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(addTourPackage.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.data = action.payload.data;
//             })
//             .addCase(addTourPackage.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });

//         // --- getTours ---
//         builder
//             .addCase(getTours.pending, (state) => {
//                 state.tourLoading = true;
//                 state.tourError = null;
//             })
//             .addCase(getTours.fulfilled, (state, action) => {
//                 state.tourLoading = false;
//                 state.tourData = action.payload.data.content;
//                 state.pagination = {
//                     pageNumber: action.payload.data.pageNumber,
//                     pageSize: action.payload.data.pageSize,
//                     totalElements: action.payload.data.totalElements,
//                     totalPages: action.payload.data.totalPages,
//                     last: action.payload.data.last,
//                 };
//             })
//             .addCase(getTours.rejected, (state, action) => {
//                 state.tourLoading = false;
//                 state.tourError = action.payload;
//             });

//         // --- changeTourPackageStatus ---
//         builder
//             .addCase(changeTourPackageStatus.pending, (state) => {
//                 state.statusLoading = true;
//                 state.statusError = null;
//                 state.statusSuccess = false;
//             })
//             .addCase(changeTourPackageStatus.fulfilled, (state, action) => {
//                 state.statusLoading = false;
//                 state.statusSuccess = true;

//                 const updatedPackage = action.payload.data;
//                 state.tourData = state.tourData.map((pkg) =>
//                     pkg.id === updatedPackage.id ? updatedPackage : pkg
//                 );
//             })
//             .addCase(changeTourPackageStatus.rejected, (state, action) => {
//                 state.statusLoading = false;
//                 state.statusError = action.payload;
//                 state.statusSuccess = false;
//             });

//         // --- getTourDetails ---
//         builder
//             .addCase(getTourDetails.pending, (state) => {
//                 state.tourDetailsLoading = true;
//                 state.tourDetailsError = null;
//                 state.tourDetailsStatus = null;
//             })
//             .addCase(getTourDetails.fulfilled, (state, action) => {
//                 state.tourDetailsLoading = false;
//                 state.tourDetails = action.payload.data || null;
//                 state.tourDetailsStatus = action.payload.status;
//             })
//             .addCase(getTourDetails.rejected, (state, action) => {
//                 state.tourDetailsLoading = false;
//                 state.tourDetailsError = action.payload || "Failed to fetch tour details";
//             });

//         // --- tourCountAwaiting ---
//         builder
//             .addCase(tourCountAwaiting.pending, (state) => {
//                 state.awaitingtourCountLoading = true;
//                 state.awaitingtourCountError = null;
//             })
//             .addCase(tourCountAwaiting.fulfilled, (state, action) => {
//                 state.awaitingtourCountLoading = false;
//                 state.awaitingtourCount = action.payload.data || 0;
//             })
//             .addCase(tourCountAwaiting.rejected, (state, action) => {
//                 state.awaitingtourCountLoading = false;
//                 state.awaitingtourCountError = action.payload || "Failed to fetch awaiting count";
//             })

//             //getTourAwaiting
//             .addCase(getTourAwaiting.pending, (state) => {
//                 state.tourAwaitingLoading = true;
//                 state.tourAwaitingError = null;
//             })
//             .addCase(getTourAwaiting.fulfilled, (state, action) => {
//                 state.tourAwaitingLoading = false;
//                 state.tourAwaiting = action.payload.data; // assuming data is an array
//             })
//             .addCase(getTourAwaiting.rejected, (state, action) => {
//                 state.tourAwaitingLoading = false;
//                 state.tourAwaitingError = action.payload || "Failed to fetch awaiting tours";
//             });
//         builder
//             //getTourAwaitingbystatus
//             .addCase(getTourAwaitingByStatus.pending, (state) => {
//                 state.tourAwaitingLoadingByStatus = true;
//                 state.tourAwaitingErrorByStatus = null;
//             })
//             .addCase(getTourAwaitingByStatus.fulfilled, (state, action) => {
//                 state.tourAwaitingLoadingByStatus = false;
//                 state.tourAwaitingByStatus = action.payload.data; // assuming data is an array
//             })
//             .addCase(getTourAwaitingByStatus.rejected, (state, action) => {
//                 state.tourAwaitingLoadingByStatus = false;
//                 state.tourAwaitingErrorByStatus = action.payload || "Failed to fetch awaiting tours";
//             });
//         //change status
//         builder
//             .addCase(changeTourAwaitingStatus.pending, (state) => {
//                 state.statusLoading = true;
//                 state.statusError = null;
//                 state.statusSuccess = false;
//             })
//             .addCase(changeTourAwaitingStatus.fulfilled, (state, action) => {
//                 state.statusLoading = false;
//                 state.statusSuccess = true;
//                 const updatedBooking = action.payload.data;
//                 state.tourAwaiting = state.tourAwaiting.map((b) =>
//                     b.ticketId === updatedBooking.ticketId ? updatedBooking : b
//                 );
//                 state.tourAwaitingByStatus = state.tourAwaitingByStatus.map((b) =>
//                     b.ticketId === updatedBooking.ticketId ? updatedBooking : b
//                 );
//             })
//             .addCase(changeTourAwaitingStatus.rejected, (state, action) => {
//                 state.statusLoading = false;
//                 state.statusError = action.payload;
//                 state.statusSuccess = false;
//             });
//     },
// });

// export default adminPackageSlice.reducer;
const adminPackageSlice = createSlice({
    name: "tourPackage",
    initialState: {
      data: null,
      loading: false,
      error: null,
  
      // tours
      tourData: [],
      tourLoading: false,
      tourError: null,
      pagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
      },
  
      // status change
      statusLoading: false,
      statusError: null,
      statusSuccess: false,
  
      // details
      tourDetails: null,
      tourDetailsLoading: false,
      tourDetailsError: null,
      tourDetailsStatus: null,
  
      // awaiting count
      awaitingtourCount: 0,
      awaitingtourCountLoading: false,
      awaitingtourCountError: null,
  
      // tourAwaiting
      tourAwaiting: [],
      tourAwaitingLoading: false,
      tourAwaitingError: null,
  
      // tourAwaitingByStatus
      tourAwaitingByStatus: [],
      tourAwaitingLoadingByStatus: false,
      tourAwaitingErrorByStatus: null,
    },
    extraReducers: (builder) => {
      // --- addTourPackage ---
      builder
        .addCase(addTourPackage.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addTourPackage.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
        })
        .addCase(addTourPackage.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  
      // --- getTours ---
      builder
        .addCase(getTours.pending, (state) => {
          state.tourLoading = true;
          state.tourError = null;
        })
        .addCase(getTours.fulfilled, (state, action) => {
          state.tourLoading = false;
          state.tourData = action.payload.data.content;
          state.pagination = {
            pageNumber: action.payload.data.pageNumber,
            pageSize: action.payload.data.pageSize,
            totalElements: action.payload.data.totalElements,
            totalPages: action.payload.data.totalPages,
            last: action.payload.data.last,
          };
        })
        .addCase(getTours.rejected, (state, action) => {
          state.tourLoading = false;
          state.tourError = action.payload;
        });
  
      // --- changeTourPackageStatus ---
      builder
        .addCase(changeTourPackageStatus.pending, (state) => {
          state.statusLoading = true;
          state.statusError = null;
          state.statusSuccess = false;
        })
        .addCase(changeTourPackageStatus.fulfilled, (state, action) => {
          state.statusLoading = false;
          state.statusSuccess = true;
  
          const updatedPackage = action.payload.data;
          state.tourData = state.tourData.map((pkg) =>
            pkg.id === updatedPackage.id ? updatedPackage : pkg
          );
        })
        .addCase(changeTourPackageStatus.rejected, (state, action) => {
          state.statusLoading = false;
          state.statusError = action.payload;
          state.statusSuccess = false;
        });
  
      // --- getTourDetails ---
      builder
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
          state.tourDetailsError =
            action.payload || "Failed to fetch tour details";
        });
  
      // --- tourCountAwaiting ---
      builder
        .addCase(tourCountAwaiting.pending, (state) => {
          state.awaitingtourCountLoading = true;
          state.awaitingtourCountError = null;
        })
        .addCase(tourCountAwaiting.fulfilled, (state, action) => {
          state.awaitingtourCountLoading = false;
          state.awaitingtourCount = action.payload.data || 0;
        })
        .addCase(tourCountAwaiting.rejected, (state, action) => {
          state.awaitingtourCountLoading = false;
          state.awaitingtourCountError =
            action.payload || "Failed to fetch awaiting count";
        });
  
      // --- getTourAwaiting ---
      builder
        .addCase(getTourAwaiting.pending, (state) => {
          state.tourAwaitingLoading = true;
          state.tourAwaitingError = null;
        })
        .addCase(getTourAwaiting.fulfilled, (state, action) => {
          state.tourAwaitingLoading = false;
          state.tourAwaiting = action.payload.data; // array
        })
        .addCase(getTourAwaiting.rejected, (state, action) => {
          state.tourAwaitingLoading = false;
          state.tourAwaitingError =
            action.payload || "Failed to fetch awaiting tours";
        });
  
      // --- getTourAwaitingByStatus ---
      builder
        .addCase(getTourAwaitingByStatus.pending, (state) => {
          state.tourAwaitingLoadingByStatus = true;
          state.tourAwaitingErrorByStatus = null;
        })
        .addCase(getTourAwaitingByStatus.fulfilled, (state, action) => {
          state.tourAwaitingLoadingByStatus = false;
          state.tourAwaitingByStatus = action.payload.data; // array
        })
        .addCase(getTourAwaitingByStatus.rejected, (state, action) => {
          state.tourAwaitingLoadingByStatus = false;
          state.tourAwaitingErrorByStatus =
            action.payload || "Failed to fetch awaiting tours";
        });
  
      // --- changeTourAwaitingStatus ---
      builder
        .addCase(changeTourAwaitingStatus.pending, (state) => {
          state.statusLoading = true;
          state.statusError = null;
          state.statusSuccess = false;
        })
        .addCase(changeTourAwaitingStatus.fulfilled, (state, action) => {
          state.statusLoading = false;
          state.statusSuccess = true;
  
          const updatedBooking = action.payload.data;
  
          // update in tourAwaiting
          state.tourAwaiting = state.tourAwaiting.map((b) =>
            b.ticketId === updatedBooking.ticketId ? updatedBooking : b
          );
  
          // update in tourAwaitingByStatus
          state.tourAwaitingByStatus = state.tourAwaitingByStatus.map((b) =>
            b.ticketId === updatedBooking.ticketId ? updatedBooking : b
          );
        })
        .addCase(changeTourAwaitingStatus.rejected, (state, action) => {
          state.statusLoading = false;
          state.statusError = action.payload;
          state.statusSuccess = false;
        });
    },
  });
  
  export default adminPackageSlice.reducer;
  
