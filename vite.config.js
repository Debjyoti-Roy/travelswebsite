import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['c161-2405-201-800d-30d1-5b7-7a08-b25c-f866.ngrok-free.app'],
    host: true,
    port: 5173
  },
  preview: {
    allowedHosts: ['c161-2405-201-800d-30d1-5b7-7a08-b25c-f866.ngrok-free.app']
  }
});
