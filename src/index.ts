/**
 * This entry file is for main unplugin.
 * @module
 */

import type { UnpluginFactory, UnpluginInstance } from "unplugin";
import type { TomlOptions } from "./types";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createFilter } from "@rollup/pluginutils";
import { parse } from "smol-toml";
import { createUnplugin } from "unplugin";
import { PLUGIN_NAME } from "./constants";

export type { TomlOptions };

const PREFIX = `\0virtual:toml:`;

/**
 * A unplugin factory, used by Unplugin to create a new plugin instance.
 */
export const unpluginFactory: UnpluginFactory<TomlOptions | undefined> = (options = {}) => {
  const filter = createFilter(
    options.include || /\.toml(\?raw)?$/,
  );

  return {
    name: PLUGIN_NAME,
    enforce: "pre",
    transformInclude(id) {
      return filter(id);
    },
    transform(code, id) {
      if (id.endsWith("?raw")) {
        return `${code}`;
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
      if (/\.toml\?raw$/.test(id) && importer) {
        const [relativePath] = id.split("?raw");
        const fullPath = join(dirname(importer), relativePath!);
        return `${PREFIX}${fullPath}:raw`;
      }
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) {
        return;
      }

      id = id.slice(PREFIX.length);

      if (id.endsWith(":raw")) {
        id = id.slice(0, -4);
      }

      const path = id;

      if (!path) {
        throw new Error("invalid path can't read toml file");
      }

      const content = (await readFile(path, "utf-8")).replace(/\r\n/g, "\n");

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
export const unplugin: UnpluginInstance<TomlOptions | undefined, boolean> = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
