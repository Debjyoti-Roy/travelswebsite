import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['a629254c7857.ngrok-free.app'],
    host: true,
    port: 5173
  },
  preview: {
    allowedHosts: ['a629254c7857.ngrok-free.app']
  }
});
