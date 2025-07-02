// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import queryReducer from "./querySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    query: queryReducer,
  },
});
