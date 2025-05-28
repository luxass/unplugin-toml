/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import type unplugin from "./";
import { createVitePlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import toml from "unplugin-toml/vite"
 *
 * export default defineConfig({
 *   plugins: [toml()],
 * })
 * ```
 */
export default createVitePlugin(unpluginFactory) as typeof unplugin.vite;
