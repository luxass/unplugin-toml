/**
 * This entry file is for main unplugin.
 * @module
 */

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { createFilter } from "@rollup/pluginutils";
import { parse } from "smol-toml";
import type { UnpluginFactory, UnpluginInstance } from "unplugin";
import { createUnplugin } from "unplugin";

import { PLUGIN_NAME } from "./constants";
import type { TomlOptions } from "./types";

export type { TomlOptions };

const PREFIX = `\0virtual:toml:`;
const DEFAULT_INCLUDE_RE = /\.toml(\?raw)?$/;
const RAW_TOML_ID_RE = /\.toml\?raw$/;
const CRLF_RE = /\r\n/g;

/**
 * A unplugin factory, used by Unplugin to create a new plugin instance.
 */
export const unpluginFactory: UnpluginFactory<TomlOptions | undefined> = (options = {}) => {
  const filter = createFilter(options.include || DEFAULT_INCLUDE_RE);

  return {
    name: PLUGIN_NAME,
    enforce: "pre",
    transformInclude(id) {
      return filter(id);
    },
    transform(code, id) {
      if (id.endsWith("?raw")) {
        return code;
      }

      let content = parse(code);

      if (options.transform != null && typeof options.transform === "function") {
        const transformed = options.transform(content, id);

        if (transformed != null) {
          content = transformed;
        }
      }

      return `var data = ${JSON.stringify(content, null, 2)};\n\nexport default data;`;
    },
    resolveId(id, importer) {
      if (RAW_TOML_ID_RE.test(id) && importer) {
        const [relativePath] = id.split("?raw");
        const fullPath = join(dirname(importer), relativePath!);
        return `${PREFIX}${fullPath}:raw`;
      }

      return undefined;
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return undefined;
      }

      id = id.slice(PREFIX.length);

      if (id.endsWith(":raw")) {
        id = id.slice(0, -4);
      }

      const path = id;

      if (!path) {
        throw new Error("invalid path can't read toml file");
      }

      const content = (await readFile(path, "utf-8")).replace(CRLF_RE, "\n");

      return {
        code: `export default ${JSON.stringify(content)}`,
        map: null,
      };
    },
  };
};

/**
 * The main unplugin instance.
 */
export const unplugin: UnpluginInstance<TomlOptions | undefined> =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
