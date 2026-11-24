import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/Doc-Lui/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        services: resolve(__dirname, "services.html"),
        booking: resolve(__dirname, "booking.html"),
        requests: resolve(__dirname, "requests.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});