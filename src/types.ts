import type { FilterPattern } from "@rollup/pluginutils";
import type {
  TomlPrimitive,
} from "smol-toml";

export interface TomlOptions {
  /**
   * Include files that match any of these patterns.
   */
  include?: FilterPattern;

  /**
   * A function to transform the parsed TOML data.
   * @param {Record<string, TomlPrimitive>} data The parsed TOML data.
   * @param {string} filePath The path to the TOML file.
   * @returns {Record<string, TomlPrimitive> | undefined} The transformed data.
   */
  transform?: (data: Record<string, TomlPrimitive>, filePath: string) => Record<string, TomlPrimitive> | undefined;
}
