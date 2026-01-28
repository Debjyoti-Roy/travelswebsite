// driveModeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickupActive: false,
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
  },
});

export const { setPickupActive, resetDriveMode } = driveModeSlice.actions;
export default driveModeSlice.reducer;