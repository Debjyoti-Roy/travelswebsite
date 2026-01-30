// driveModeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickupActive: false,
  booking: {}
};

const driveModeSlice = createSlice({
  name: "driveMode",
  initialState,
  reducers: {
    setPickupActive: (state, action) => {
      state.pickupActive = action.payload;
    },
    resetDriveMode: (state) => {
      state.pickupActive = false;
    },
    setCurrentPickupBookings: (state, action) => {
      state.booking = action.payload
    },
    resetCurrentPickupBookings: (state) => {
      state.booking = {}
    }
  },
});

export const { setPickupActive, resetDriveMode, setCurrentPickupBookings, resetCurrentPickupBookings } = driveModeSlice.actions;
export default driveModeSlice.reducer;