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


// const adminCarSlice = createSlice({
//   name: "adminCar",
//   initialState: {
//     states: [],
//     statesloading: false,
//     stateserror: null,
//     loading: false,
//     error: null,
//     loading2: false,
//     error2: null,
//     loading3: false,
//     error3: null,
//     loading4: false,    // ✅ for updateCarPrices
//     error4: null,       // ✅ for updateCarPrices
//     carPackageResponse: null,
//     updateResponse: null,
//     updatePriceResponse: null, // ✅ response of updateCarPrices
//     carPackages: [],
//     carPackageDetails: null,
//     pagination: {
//       pageNumber: 0,
//       pageSize: 10,
//       totalElements: 0,
//       totalPages: 0,
//       last: true,
//     },
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // ✅ getStates
//       .addCase(getStates.pending, (state) => {
//         state.statesloading = true;
//         state.stateserror = null;
//       })
//       .addCase(getStates.fulfilled, (state, action) => {
//         state.statesloading = false;
//         state.states = action.payload.data;
//       })
//       .addCase(getStates.rejected, (state, action) => {
//         state.statesloading = false;
//         state.stateserror = action.payload;
//       })

//       // ✅ addCarPackage
//       .addCase(addCarPackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.carPackageResponse = null;
//       })
//       .addCase(addCarPackage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.carPackageResponse = action.payload.data;
//       })
//       .addCase(addCarPackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ updateCarPackage
//       .addCase(updateCarPackage.pending, (state) => {
//         state.loading3 = true;
//         state.error3 = null;
//         state.updateResponse = null;
//       })
//       .addCase(updateCarPackage.fulfilled, (state, action) => {
//         state.loading3 = false;
//         state.updateResponse = action.payload.data;

//         // also update the carPackages list if present
//         const updatedPkg = action.payload.data;
//         const idx = state.carPackages.findIndex(
//           (pkg) => pkg.packageId === updatedPkg.packageId
//         );
//         if (idx !== -1) {
//           state.carPackages[idx] = {
//             ...state.carPackages[idx],
//             ...updatedPkg,
//           };
//         }
//       })
//       .addCase(updateCarPackage.rejected, (state, action) => {
//         state.loading3 = false;
//         state.error3 = action.payload;
//       })

//       // ✅ updateCarPrices
//       .addCase(updateCarPrices.pending, (state) => {
//         state.loading4 = true;
//         state.error4 = null;
//         state.updatePriceResponse = null;
//       })
//       .addCase(updateCarPrices.fulfilled, (state, action) => {
//         state.loading4 = false;
//         state.updatePriceResponse = action.payload.data;

//         // also update price in carPackages list if available
//         const updatedPricePkg = action.payload.data;
//         const idx = state.carPackages.findIndex(
//           (pkg) => pkg.packageId === updatedPricePkg.packageId
//         );
//         if (idx !== -1) {
//           state.carPackages[idx] = {
//             ...state.carPackages[idx],
//             ...updatedPricePkg,
//           };
//         }
//       })
//       .addCase(updateCarPrices.rejected, (state, action) => {
//         state.loading4 = false;
//         state.error4 = action.payload;
//       })

//       // ✅ getAllCarPackages
//       .addCase(getAllCarPackages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAllCarPackages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.carPackages = action.payload.data.content;
//         state.pagination = {
//           pageNumber: action.payload.data.pageNumber,
//           pageSize: action.payload.data.pageSize,
//           totalElements: action.payload.data.totalElements,
//           totalPages: action.payload.data.totalPages,
//           last: action.payload.data.last,
//         };
//       })
//       .addCase(getAllCarPackages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ changeCarPackageStatus
//       .addCase(changeCarPackageStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(changeCarPackageStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedId = action.payload.id;
//         const updatedPkgIndex = state.carPackages.findIndex(
//           (pkg) => pkg.packageId === updatedId
//         );
//         if (updatedPkgIndex !== -1) {
//           state.carPackages[updatedPkgIndex].isActive =
//             !state.carPackages[updatedPkgIndex].isActive;
//         }
//       })
//       .addCase(changeCarPackageStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ getCarPackageDetails
//       .addCase(getCarPackageDetails.pending, (state) => {
//         state.loading2 = true;
//         state.error2 = null;
//         state.carPackageDetails = null;
//       })
//       .addCase(getCarPackageDetails.fulfilled, (state, action) => {
//         state.loading2 = false;
//         state.carPackageDetails = action.payload.data;
//       })
//       .addCase(getCarPackageDetails.rejected, (state, action) => {
//         state.loading2 = false;
//         state.error2 = action.payload;
//       });
//   },
// });

// export default adminCarSlice.reducer;
// const adminCarSlice = createSlice({
//     name: "adminCar",
//     initialState: {
//         states: [],
//         statesloading: false,
//         stateserror: null,

//         loading: false,
//         error: null,

//         loading2: false,
//         error2: null,

//         loading3: false,
//         error3: null,

//         loading4: false, // ✅ for updateCarPrices
//         error4: null, // ✅ for updateCarPrices

//         loading5: false, // ✅ for addCar
//         error5: null, // ✅ for addCar

//         carPackageResponse: null,
//         updateResponse: null,
//         updatePriceResponse: null,
//         carPackages: [],
//         carPackageDetails: null,

//         pagination: {
//             pageNumber: 0,
//             pageSize: 10,
//             totalElements: 0,
//             totalPages: 0,
//             last: true,
//         },
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             // ✅ getStates
//             .addCase(getStates.pending, (state) => {
//                 state.statesloading = true;
//                 state.stateserror = null;
//             })
//             .addCase(getStates.fulfilled, (state, action) => {
//                 state.statesloading = false;
//                 state.states = action.payload.data;
//             })
//             .addCase(getStates.rejected, (state, action) => {
//                 state.statesloading = false;
//                 state.stateserror = action.payload;
//             })

//             // ✅ addCarPackage
//             .addCase(addCarPackage.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//                 state.carPackageResponse = null;
//             })
//             .addCase(addCarPackage.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.carPackageResponse = action.payload.data;
//             })
//             .addCase(addCarPackage.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // ✅ updateCarPackage
//             .addCase(updateCarPackage.pending, (state) => {
//                 state.loading3 = true;
//                 state.error3 = null;
//                 state.updateResponse = null;
//             })
//             .addCase(updateCarPackage.fulfilled, (state, action) => {
//                 state.loading3 = false;
//                 state.updateResponse = action.payload.data;

//                 // also update the carPackages list if present
//                 const updatedPkg = action.payload.data;
//                 const idx = state.carPackages.findIndex(
//                     (pkg) => pkg.packageId === updatedPkg.packageId
//                 );
//                 if (idx !== -1) {
//                     state.carPackages[idx] = {
//                         ...state.carPackages[idx],
//                         ...updatedPkg,
//                     };
//                 }
//             })
//             .addCase(updateCarPackage.rejected, (state, action) => {
//                 state.loading3 = false;
//                 state.error3 = action.payload;
//             })

//             // ✅ updateCarPrices
//             .addCase(updateCarPrices.pending, (state) => {
//                 state.loading4 = true;
//                 state.error4 = null;
//                 state.updatePriceResponse = null;
//             })
//             .addCase(updateCarPrices.fulfilled, (state, action) => {
//                 state.loading4 = false;
//                 state.updatePriceResponse = action.payload.data;

//                 // also update price in carPackages list if available
//                 const updatedPricePkg = action.payload.data;
//                 const idx = state.carPackages.findIndex(
//                     (pkg) => pkg.packageId === updatedPricePkg.packageId
//                 );
//                 if (idx !== -1) {
//                     state.carPackages[idx] = {
//                         ...state.carPackages[idx],
//                         ...updatedPricePkg,
//                     };
//                 }
//             })
//             .addCase(updateCarPrices.rejected, (state, action) => {
//                 state.loading4 = false;
//                 state.error4 = action.payload;
//             })

//             // ✅ addCar
//             .addCase(addCartoPackage.pending, (state) => {
//                 state.loading5 = true;
//                 state.error5 = null;
//             })
//             .addCase(addCartoPackage.fulfilled, (state, action) => {
//                 state.loading5 = false;
//                 const newCar = action.payload.data;

//                 // update carPackageDetails if available
//                 if (state.carPackageDetails?.carDetails) {
//                     state.carPackageDetails.carDetails.push(newCar);
//                 }

//                 // also update inside carPackages list if packageId matches
//                 const pkgIndex = state.carPackages.findIndex(
//                     (pkg) => pkg.packageId === newCar.packageId
//                 );
//                 if (pkgIndex !== -1) {
//                     state.carPackages[pkgIndex] = {
//                         ...state.carPackages[pkgIndex],
//                         carDetails: [
//                             ...(state.carPackages[pkgIndex].carDetails || []),
//                             newCar,
//                         ],
//                     };
//                 }
//             })
//             .addCase(addCartoPackage.rejected, (state, action) => {
//                 state.loading5 = false;
//                 state.error5 = action.payload;
//             })

//             // ✅ getAllCarPackages
//             .addCase(getAllCarPackages.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(getAllCarPackages.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.carPackages = action.payload.data.content;
//                 state.pagination = {
//                     pageNumber: action.payload.data.pageNumber,
//                     pageSize: action.payload.data.pageSize,
//                     totalElements: action.payload.data.totalElements,
//                     totalPages: action.payload.data.totalPages,
//                     last: action.payload.data.last,
//                 };
//             })
//             .addCase(getAllCarPackages.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // ✅ changeCarPackageStatus
//             .addCase(changeCarPackageStatus.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(changeCarPackageStatus.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const updatedId = action.payload.id;
//                 const updatedPkgIndex = state.carPackages.findIndex(
//                     (pkg) => pkg.packageId === updatedId
//                 );
//                 if (updatedPkgIndex !== -1) {
//                     state.carPackages[updatedPkgIndex].isActive =
//                         !state.carPackages[updatedPkgIndex].isActive;
//                 }
//             })
//             .addCase(changeCarPackageStatus.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // ✅ getCarPackageDetails
//             .addCase(getCarPackageDetails.pending, (state) => {
//                 state.loading2 = true;
//                 state.error2 = null;
//                 state.carPackageDetails = null;
//             })
//             .addCase(getCarPackageDetails.fulfilled, (state, action) => {
//                 state.loading2 = false;
//                 state.carPackageDetails = action.payload.data;
//             })
//             .addCase(getCarPackageDetails.rejected, (state, action) => {
//                 state.loading2 = false;
//                 state.error2 = action.payload;
//             });
//     },
// });

// export default adminCarSlice.reducer;
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

        pagination: {
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
            });
    },
});

export default adminCarSlice.reducer;