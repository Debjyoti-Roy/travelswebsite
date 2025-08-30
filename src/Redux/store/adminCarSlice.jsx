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


const adminCarSlice = createSlice({
    name: "adminCar",
    initialState: {
        states: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStates.fulfilled, (state, action) => {
                state.loading = false;
                state.states = action.payload.data; // save fetched states
            })
            .addCase(getStates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminCarSlice.reducer;
