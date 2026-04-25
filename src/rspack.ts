/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { createRspackPlugin } from "unplugin";

import type unplugin from "./";
import { unpluginFactory } from "./";
/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.ts
 * import toml from "unplugin-toml/rspack"
 *
 * export default defineConfig({
 *   plugins: [toml()],
 * })
 * ```
 */
export default createRspackPlugin(unpluginFactory) as typeof unplugin.rspack;
