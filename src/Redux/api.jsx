// src/api/api.js
import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_PUBLICDOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
export const api2 = axios.create({
  baseURL: import.meta.env.VITE_API_PUBLICDOMAIN,
});

export const api3 = axios.create({
  baseURL: import.meta.env.VITE_API_PUBLICDOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: "repeat" }), // 👈 key part
});

// export default api2;
