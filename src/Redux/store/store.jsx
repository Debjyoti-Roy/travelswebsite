// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import queryReducer from "./querySlice";
import profileReducer from "./profileSlice"
import partnerReducer from "./partnerSlice"
import hotelReducer from "./hotelSlice"
import paymentReducer from './paymentSlice'
import analyticsReducer from './analyticsSlice'
import adminReducer from './adminSlices'
import adminCarReducer from './adminCarSlice'
import carPackageReducer from './carPackageSlice'
import partnercarReducers from './partnerCar'
import tourPackageReducer from './tourPackageSlice'
import adminTourReducer from "./adminTourSlice"
import adminPartnerReducer from "./adminPartnerSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    query: queryReducer,
    profile: profileReducer,
    partner: partnerReducer,
    hotel: hotelReducer,
    payment: paymentReducer,
    analytics: analyticsReducer,
    admin: adminReducer,
    admincar: adminCarReducer,
    carPackage:carPackageReducer,
    partnerCar:partnercarReducers,
    tourPackage:tourPackageReducer,
    adminTour:adminTourReducer,
    adminPartner:adminPartnerReducer
  },
});
