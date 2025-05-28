/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import type unplugin from "./";
import { createRolldownPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import toml from "unplugin-toml/rolldown"
 *
 * export default {
 *   plugins: [toml()],
 * }
 * ```
 */
export default createRolldownPlugin(unpluginFactory) as typeof unplugin.rolldown;
