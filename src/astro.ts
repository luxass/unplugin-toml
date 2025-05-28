/**
 * This entry file is for Astro integration.
 *
 * @module
 */

import type { AstroIntegration } from "astro";
import type { TomlOptions } from "./types";
import { unplugin } from "./";
import { PLUGIN_NAME } from "./constants";

/**
 * Astro integration
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import toml from "unplugin-toml/astro"
 *
 * export default defineConfig({
 *   integrations: [toml()],
 * })
 * ```
 */
export default function TomlIntegration(options: TomlOptions): AstroIntegration {
  return {
    name: PLUGIN_NAME,
    hooks: {
      "astro:config:setup": async (astro: any) => {
        astro.config.vite.plugins ||= [];
        astro.config.vite.plugins.push(unplugin.vite(options));
      },
    },
  };
}
