/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import type unplugin from "./";
import { createRollupPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import toml from "unplugin-toml/rollup"
 *
 * export default {
 *   plugins: [toml()],
 * }
 * ```
 */
export default createRollupPlugin(unpluginFactory) as typeof unplugin.rollup;
