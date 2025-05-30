import Vue from "@vitejs/plugin-vue";
import TomlPlugin from "unplugin-toml/vite";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import VueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Vue(),
    VueDevTools(),
    TomlPlugin(),
    Inspect(),
  ],
});
