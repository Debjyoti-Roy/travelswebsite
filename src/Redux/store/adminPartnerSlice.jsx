import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getAllPartnerRequests = createAsyncThunk(
    "partner/get-all-partner-request",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/v1/private/partner/all-partner-request`, {
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

const partnerSlice = createSlice({
    name: "partner",
    initialState: {
      requests: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAllPartnerRequests.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllPartnerRequests.fulfilled, (state, action) => {
          state.loading = false;
          state.requests = action.payload.data || [];
        })
        .addCase(getAllPartnerRequests.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        });
    },
  });
  
  export default partnerSlice.reducer;