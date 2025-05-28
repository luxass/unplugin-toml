/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import type unplugin from "./";
import { createFarmPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.ts
 * import toml from "unplugin-toml/farm"
 *
 * export default defineConfig({
 *   plugins: [toml()],
 * }
 * ```
 */
export default createFarmPlugin(unpluginFactory) as typeof unplugin.farm;
