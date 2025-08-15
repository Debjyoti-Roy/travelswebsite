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
export const getAwaiting = createAsyncThunk(
    "admin/get-awaiting",
    async (_, { rejectWithValue }) => {
        const token=localStorage.getItem('token')
        try {
            const response = await api.get(
                `/v1/private/bookings/poll/get-awaiting`,
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
        awaitingData: [],
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
        resetAwaitingData: (state) => {
            state.awaitingData = [];
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
            })
            .addCase(getAwaiting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAwaiting.fulfilled, (state, action) => {
                state.loading = false;
                state.awaitingData = action.payload.data;
                state.error = null;
            })
            .addCase(getAwaiting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch awaiting data";
            });
    },
});

export const { clearError, resetAwaitingCount, resetAwaitingData } = adminSlice.actions;
export default adminSlice.reducer;