import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Changez si nécessaire
    open: true,
    hmr: {
      overlay: true, // Affiche les erreurs sur la page
    },
  },
});
