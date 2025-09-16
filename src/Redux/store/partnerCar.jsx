import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getCars = createAsyncThunk(
    "partner/getCars",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await api.get("/v1/partner/car/get-all", {
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
export const addCars = createAsyncThunk(
    "partner/addCars",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await api.post("/v1/partner/car/add", {
                // body
                carType: body.carType,
                carModel: body.carModel,
                carPlateNumber: body.carPlateNumber,
                acAvailable: body.acAvailable,
                driverName: body.driverName,
                driverPhoneNumber: body.driverPhoneNumber,
                driverLicenseNumber: body.driverLicenseNumber,

            },
                {
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
export const editCars = createAsyncThunk(
    "partner/editCars",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await api.patch("/v1/partner/car/update", {
                carId:body.carId,
                carType: body.carType,
                carModel: body.carModel,
                carPlateNumber: body.carPlateNumber,
                acAvailable: body.acAvailable,
                driverName: body.driverName,
                driverPhoneNumber: body.driverPhoneNumber,
                driverLicenseNumber: body.driverLicenseNumber,
            },
                {
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
export const editStatus = createAsyncThunk(
    "partner/editStatus",
    async ({ token, carId }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/v1/partner/car/${carId}/update-status`, {},
                {
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


const initialState = {
    cars: [],
    status: "idle",
    error: null,
  };
  
  const carSlice = createSlice({
    name: "cars",
    initialState,
    reducers: {
      clearCars: (state) => {
        state.cars = [];
        state.status = "idle";
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // 🔹 GET Cars
        .addCase(getCars.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(getCars.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.cars = action.payload.data;
        })
        .addCase(getCars.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        })
  
        // 🔹 ADD Car
        .addCase(addCars.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(addCars.fulfilled, (state, action) => {
          state.status = "succeeded";
          if (action.payload?.data) {
            state.cars.push(action.payload.data);
          }
        })
        .addCase(addCars.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        })
  
        // 🔹 EDIT Car
        .addCase(editCars.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(editCars.fulfilled, (state, action) => {
          state.status = "succeeded";
          if (action.payload?.data) {
            const updatedCar = action.payload.data;
            state.cars = state.cars.map((car) =>
              car.carPlateNumber === updatedCar.carPlateNumber
                ? { ...car, ...updatedCar }
                : car
            );
          }
        })
        .addCase(editCars.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        })
        // 🔹 EDIT Car status
        .addCase(editStatus.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(editStatus.fulfilled, (state, action) => {
          state.status = "succeeded";
          if (action.payload?.data) {
            const updatedCar = action.payload.data;
            state.cars = state.cars.map((car) =>
              car.carPlateNumber === updatedCar.carPlateNumber
                ? { ...car, ...updatedCar }
                : car
            );
          }
        })
        .addCase(editStatus.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        });
    },
  });
  
  export const { clearCars } = carSlice.actions;
  export default carSlice.reducer;