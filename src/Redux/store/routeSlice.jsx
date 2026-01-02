import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const addRoutes = createAsyncThunk(
    "route/addRoutes",
    async (routes, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.post(
          `/v1/private/car-package-bookings/add-route`,
          routes,
          {
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
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message || "Something went wrong");
      }
    }
  );

  export const getAllRoutes = createAsyncThunk(
    "route/getAllRoutes",
    async (_, { rejectWithValue }) => {
      try {
        const token=localStorage.getItem("token")
        const response = await api.get("/v1/private/car-package-bookings/get-all-route", {
          headers: {
            Authorization: `Bearer ${token}`,
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
  export const getAllLocations = createAsyncThunk(
    "route/getAllLocations",
    async (_, { rejectWithValue }) => {
        const token=localStorage.getItem("token")
      try {
        const response = await api.get("/v1/private/car-package-bookings/get-all-locations", {
          headers: {
            Authorization: `Bearer ${token}`,
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

  export const deleteRoute = createAsyncThunk(
    "route/deleteRoute",
    async ({ id }, thunkAPI) => {
      try {
        const token=localStorage.getItem("token")
        const response = await api.delete(`/v1/private/car-package-bookings/delete-pickup-route`, {
          params: {
            id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "xyz", // optional if needed
          },
        });
        return {
          data: response.data,
          status: response.status,
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  export const updateRoute = createAsyncThunk(
    "route/updateRoute",
    async ({routeData, id }, thunkAPI) => {
      try {
        const token=localStorage.getItem("token")
        const response = await api.patch(`/v1/private/car-package-bookings/update-pickup-route`, routeData, {
          params: {
            id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "xyz", // optional if needed
          },
        });
        return {
          data: response.data,
          status: response.status,
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

const routeSlice = createSlice({
  name: "route",
  initialState: {
    routeData: null,
    loading: false,
    error: null,
    success: false,
    allRoutes: [],
    allRoutesLoading: false,
    allRoutesError: null,
    allRoutesSuccess: false,
    allLocations: [],
    allLocationsLoading: false,
    allLocationsError: null,
    allLocationsSuccess: false,
    deleteRouteLoading: false,
    deleteRouteError: null,
    deleteRouteSuccess: false,
    updateRouteLoading: false,
    updateRouteError: null,
    updateRouteSuccess: false,
    updateRouteData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.routeData = action.payload;
      })
      .addCase(addRoutes.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(getAllRoutes.pending, (state) => {
        state.allRoutesLoading = true;
        state.allRoutesError = null;
        state.allRoutesSuccess = false;
      })
      .addCase(getAllRoutes.fulfilled, (state, action) => {
        state.allRoutesLoading = false;
        state.allRoutesSuccess = true;
        // Handle both { data: [...], status: ... } and direct array response
        state.allRoutes = Array.isArray(action.payload.data) 
          ? action.payload.data 
          : Array.isArray(action.payload) 
          ? action.payload 
          : [];
      })
      .addCase(getAllRoutes.rejected, (state, action) => {
        state.allRoutesLoading = false;
        state.allRoutesSuccess = false;
        state.allRoutesError = action.payload;
      })
      .addCase(getAllLocations.pending, (state) => {
        state.allLocationsLoading = true;
        state.allLocationsError = null;
        state.allLocationsSuccess = false;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.allLocationsLoading = false;
        state.allLocationsSuccess = true;
        // Handle both { data: [...], status: ... } and direct array response
        state.allLocations = Array.isArray(action.payload.data) 
          ? action.payload.data 
          : Array.isArray(action.payload) 
          ? action.payload 
          : [];
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.allLocationsLoading = false;
        state.allLocationsSuccess = false;
        state.allLocationsError = action.payload;
      })
      .addCase(deleteRoute.pending, (state) => {
        state.deleteRouteLoading = true;
        state.deleteRouteError = null;
        state.deleteRouteSuccess = false;
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.deleteRouteLoading = false;
        state.deleteRouteSuccess = true;
        // Remove deleted route from allRoutes array
        if (action.payload.data?.id) {
          state.allRoutes = state.allRoutes.filter(
            (route) => route.id !== action.payload.data.id
          );
        }
      })
      .addCase(deleteRoute.rejected, (state, action) => {
        state.deleteRouteLoading = false;
        state.deleteRouteSuccess = false;
        state.deleteRouteError = action.payload;
      })
      .addCase(updateRoute.pending, (state) => {
        state.updateRouteLoading = true;
        state.updateRouteError = null;
        state.updateRouteSuccess = false;
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        state.updateRouteLoading = false;
        state.updateRouteSuccess = true;
        state.updateRouteData = action.payload;
        // Update the route in allRoutes array
        if (action.payload.data) {
          const updatedRoute = action.payload.data;
          const index = state.allRoutes.findIndex(
            (route) => route.id === updatedRoute.id
          );
          if (index !== -1) {
            state.allRoutes[index] = { ...state.allRoutes[index], ...updatedRoute };
          }
        }
      })
      .addCase(updateRoute.rejected, (state, action) => {
        state.updateRouteLoading = false;
        state.updateRouteSuccess = false;
        state.updateRouteError = action.payload;
      });
  },
});

export default routeSlice.reducer;