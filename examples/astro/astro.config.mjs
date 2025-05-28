import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import TomlPlugin from "unplugin-toml/astro";
import Inspect from "vite-plugin-inspect";

// https://astro.build/config
export default defineConfig({
  integrations: [
    TomlPlugin(),
  ],
  vite: {
    plugins: [tailwindcss(), Inspect()],
  },
});
