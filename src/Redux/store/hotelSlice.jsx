import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
// import api from "../../api"; // adjust the path if needed

// Create async thunk
export const createHotel = createAsyncThunk(
  "hotel/createHotel",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/v1/partner/createhotel",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //   return response.data;
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addRooms = createAsyncThunk(
  "hotel/addRooms",
  async ({ token, roomsData, partnerId }, { rejectWithValue }) => {
    try {
      const id = 7
      const response = await api.post(
        `/v1/partner/${id}/rooms`,
        roomsData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

export const getHotels = createAsyncThunk(
  "hotel/getHotels",
  async ({token}, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/partner/gethotels", {
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

const hotelSlice = createSlice({
  name: "hotel",
  initialState: {
    hotelData: null,
    loading: false,
    error: null,
    rooms: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelData = action.payload;
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addRooms.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.rooms = action.payload;
      })
      .addCase(addRooms.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(getHotels.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.hotels = action.payload;
      })
      .addCase(getHotels.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export default hotelSlice.reducer;
