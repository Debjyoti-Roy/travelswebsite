import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const countAwaiting = createAsyncThunk(
    "hotel/count-awaiting",
    async (_, { rejectWithValue }) => {
        const token=localStorage.getItem('token')
        try {
            const response = await api.get(
                `/v1/private/bookings/poll/count-awaiting`,
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
            return rejectWithValue(error.response?.data || "Refund status fetch failed");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        awaitingCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAwaitingCount: (state) => {
            state.awaitingCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(countAwaiting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(countAwaiting.fulfilled, (state, action) => {
                state.loading = false;
                state.awaitingCount = action.payload.data;
                state.error = null;
            })
            .addCase(countAwaiting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch awaiting count";
            });
    },
});

export const { clearError, resetAwaitingCount } = adminSlice.actions;
export default adminSlice.reducer;