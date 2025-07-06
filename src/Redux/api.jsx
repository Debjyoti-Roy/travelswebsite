// src/api/api.js
import axios from "axios";

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

// export default api2;
