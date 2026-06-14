import { join } from "node:path";

import { dedent } from "@luxass/utils";
import { build } from "esbuild";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";

import TOMLPlugin from "../src/esbuild";

describe("esbuild", () => {
  it("expect toml import to be a json object", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    await build({
      entryPoints: [join(testdirPath, "basic.js")],
      format: "esm",
      outfile: join(testdirPath, "output.js"),
      bundle: true,
      minifySyntax: false,
      plugins: [TOMLPlugin()],
    });

    const module = await import(join(testdirPath, "output.js"));
    expect(Object.keys(module)).toEqual(["config"]);

    expect(module.config).toEqual({
      pluginDir: "./plugins",
      web: { enabled: true },
      logging: { type: "stdout", level: "info" },
    });
  });

  it("expect toml import to be a string", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    await build({
      entryPoints: [join(testdirPath, "basic-raw.js")],
      format: "esm",
      outfile: join(testdirPath, "output-raw.js"),
      bundle: true,
      minifySyntax: false,
      plugins: [TOMLPlugin()],
    });

    const module = await import(join(testdirPath, "output-raw.js"));
    expect(Object.keys(module)).toEqual(["config"]);

    expect(module.config).toMatch(dedent`
      pluginDir = "./plugins"

      [web]
      enabled = true

      [logging]
      type = "stdout"
      level = "info"
    `);
  });

  it("handle transforms", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/transform"));

    expect(testdirPath).toBeDefined();

    await build({
      entryPoints: [join(testdirPath, "transform.js")],
      format: "esm",
      outfile: join(testdirPath, "output-transform.js"),
      bundle: true,
      minifySyntax: false,
      plugins: [
        TOMLPlugin({
          transform(data) {
            if (data != null && typeof data === "object" && "this" in data) {
              return {
                this: "transformed",
              };
            }

            return data;
          },
        }),
      ],
    });

    const module = await import(join(testdirPath, "output-transform.js"));
    expect(Object.keys(module)).toEqual(["config"]);

    expect(module.config).toEqual({
      this: "transformed",
    });
  });
});
