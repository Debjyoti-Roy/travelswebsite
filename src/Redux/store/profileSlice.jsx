// src/redux/slices/profileSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { api2 } from "../api";

// ----------------- Upload profile image -----------------
export const uploadProfileImage = createAsyncThunk(
  "profile/uploadProfileImage",
  async ({ file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await api2.patch("/v1/private/updateprofile/image", formData, { headers });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------- Upload profile details -----------------
export const uploadProfileDetails = createAsyncThunk(
  "profile/uploadProfileDetails",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await api.patch("/v1/private/updateprofile", data, { headers });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------- Get queries for user -----------------
export const fetchUserQueries = createAsyncThunk(
  "profile/fetchUserQueries",
  async ({ token, page = 0, size = 5, status = "OPEN" }, { rejectWithValue }) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz",
      };

      let url = `/v1/private/get-queries-for-user?page=${page}&size=${size}`;

      // If status !== ALL, append status
      if (status !== "ALL") {
        url += `&status=${status}`;
      }

      // Use api or api2 depending on your setup
      const response = await api.get(url, { headers });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------- Slice -----------------
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
    queries: [], // <- new state for queries
    queriesLoading: false,
    queriesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Upload Image
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Upload Details
    builder
      .addCase(uploadProfileDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadProfileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch User Queries
    builder
      .addCase(fetchUserQueries.pending, (state) => {
        state.queriesLoading = true;
        state.queriesError = null;
      })
      .addCase(fetchUserQueries.fulfilled, (state, action) => {
        state.queriesLoading = false;
        state.queries = action.payload.data;
      })
      .addCase(fetchUserQueries.rejected, (state, action) => {
        state.queriesLoading = false;
        state.queriesError = action.payload;
      });
  },
});

export default profileSlice.reducer;
