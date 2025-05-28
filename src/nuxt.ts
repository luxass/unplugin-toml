/**
 * This entry file is for Nuxt plugin.
 *
 * @module
 */

import type { NuxtModule } from "@nuxt/schema";
import type { TomlOptions } from "./";
import { addRspackPlugin, addVitePlugin, addWebpackPlugin, defineNuxtModule } from "@nuxt/kit";
import { NUXT_CONFIG_KEY, PLUGIN_NAME } from "./constants";
import rspack from "./rspack";
import vite from "./vite";
import webpack from "./webpack";

/**
 * Nuxt plugin
 *
 * @example
 * ```ts
 * // nuxt.config.ts
 * import toml from "unplugin-toml/nuxt"
 *
 * export default defineNuxtConfig({
 *   plugins: [toml()],
 * })
 * ```
 */
export default defineNuxtModule<TomlOptions>({
  meta: {
    name: PLUGIN_NAME,
    configKey: NUXT_CONFIG_KEY,
  },
  setup(options, nuxt) {
    nuxt.options.typescript.tsConfig ||= {};
    nuxt.options.typescript.tsConfig.compilerOptions ||= {};
    nuxt.options.typescript.tsConfig.compilerOptions.types ||= [];
    nuxt.options.typescript.tsConfig.compilerOptions.types.push("unplugin-toml/types");

    addWebpackPlugin(() => webpack(options));
    addVitePlugin(() => vite(options));
    addRspackPlugin(() => rspack(options));
  },
}) as NuxtModule<TomlOptions>;
