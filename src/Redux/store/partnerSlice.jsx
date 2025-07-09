import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // your existing api instance

// --- Thunk to register partner (your existing one) ---
export const registerPartner = createAsyncThunk(
  "partner/registerPartner",
  async ({ newData, token }, { rejectWithValue }) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await api.post("/v1/private/partner/register", newData, { headers });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- New thunk to fetch partner profile ---
export const fetchPartnerProfile = createAsyncThunk(
  "partner/fetchPartnerProfile",
  async ({ token }, { rejectWithValue }) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz",
      };
      const response = await api.get("/v1/private/partner/partner-profile", { headers });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPartnerArea = createAsyncThunk(
  "partner/getPartnerArea",
  async ({ token }, { rejectWithValue }) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "xyz",
      };
      const response = await api.get("/v1/partner/get-area", { headers });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const partnerSlice = createSlice({
  name: "partner",
  initialState: {
    partnerData: null,
    profileData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register Partner
      .addCase(registerPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.partnerData = action.payload;
      })
      .addCase(registerPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Partner Profile
      .addCase(fetchPartnerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchPartnerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPartnerArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartnerArea.fulfilled, (state, action) => {
        state.loading = false;
        state.areaData = action.payload;
      })
      .addCase(getPartnerArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default partnerSlice.reducer;
