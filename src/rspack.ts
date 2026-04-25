/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { createRspackPlugin } from "unplugin";

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
export default createRspackPlugin(unpluginFactory);
