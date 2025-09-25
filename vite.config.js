import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['6f71430904c3.ngrok-free.app'],
    host: true,
    port: 5173
  },
  preview: {
    allowedHosts: ['6f71430904c3.ngrok-free.app']
  }
});
