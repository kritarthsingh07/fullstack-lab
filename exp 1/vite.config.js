import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite config for a React project.
// This just tells Vite to use the React plugin.
export default defineConfig({
  plugins: [react()],
});
