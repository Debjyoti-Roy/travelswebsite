// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import queryReducer from "./querySlice";
import profileReducer from "./profileSlice"
import partnerReducer from "./partnerSlice"
import hotelReducer from "./hotelSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    query: queryReducer,
    profile: profileReducer,
    partner:partnerReducer,
    hotel:hotelReducer
  },
});
