import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import toml from "unplugin-toml/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    toml(),
    tailwindcss(),
    inspect(),
  ],
});
