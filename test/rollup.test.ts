import { join } from "node:path";

import { dedent } from "@luxass/utils";
import { rollup } from "rollup";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";

import TOMLPlugin from "../src/rollup";

describe("rollup", () => {
  it("expect toml import to be a json object", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    const bundle = await rollup({
      input: join(testdirPath, "basic.js"),
      plugins: [TOMLPlugin()],
    });

    await bundle.write({
      dir: join(testdirPath, "dist"),
      format: "esm",
      sourcemap: false,
    });

    const module = await import(join(testdirPath, "dist/basic.js"));
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

    const bundle = await rollup({
      input: join(testdirPath, "basic-raw.js"),
      plugins: [TOMLPlugin()],
    });

    await bundle.write({
      dir: join(testdirPath, "dist"),
      format: "esm",
      sourcemap: false,
    });

    const module = await import(join(testdirPath, "dist/basic-raw.js"));
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

    const bundle = await rollup({
      input: join(testdirPath, "transform.js"),
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

    await bundle.write({
      dir: join(testdirPath, "dist"),
      format: "esm",
      sourcemap: false,
    });

    const module = await import(join(testdirPath, "dist/transform.js"));
    expect(Object.keys(module)).toEqual(["config"]);

    expect(module.config).toEqual({
      this: "transformed",
    });
  });
});
