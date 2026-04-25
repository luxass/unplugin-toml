import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import toml from "unplugin-toml/vite";
import vueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import vueDevtools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueRouter(), vue(), vueDevtools(), toml(), inspect(), tailwindcss()],
});
