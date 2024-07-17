import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.VITE_PORT || 5173,
  },
  // define: {
  // env variables go here
  // "process.env.VITE_API_ENDPOINT": JSON.stringify(
  //   process.env.VITE_API_ENDPOINT
  // ),
  // },
});
