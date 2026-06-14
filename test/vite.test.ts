import { join } from "node:path";

import { dedent } from "@luxass/utils";
import { build } from "vite";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";

import TOMLPlugin from "../src/vite";

describe("vite", () => {
  it("expect toml import to be a json object", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      cacheDir: join(testdirPath, ".vite"),
      configFile: false,
      envFile: false,
      logLevel: "silent",
      root: testdirPath,
      build: {
        emptyOutDir: true,
        lib: {
          entry: join(testdirPath, "basic.js"),
          formats: ["es"],
          fileName: "bundle",
          name: "bundle",
        },
        outDir: join(testdirPath, "dist"),
        minify: false,
      },
      plugins: [TOMLPlugin()],
    });

    if (!Array.isArray(result)) {
      expect.fail("result is not an array");
    }

    expect(result).toBeDefined();

    const module = await import(join(testdirPath, "dist/bundle.js"));
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

    const result = await build({
      cacheDir: join(testdirPath, ".vite"),
      configFile: false,
      envFile: false,
      logLevel: "silent",
      root: testdirPath,
      build: {
        emptyOutDir: true,
        lib: {
          entry: join(testdirPath, "basic-raw.js"),
          formats: ["es"],
          fileName: "bundle",
          name: "bundle",
        },
        outDir: join(testdirPath, "dist"),
        minify: false,
      },
      plugins: [TOMLPlugin()],
    });

    if (!Array.isArray(result)) {
      expect.fail("result is not an array");
    }

    expect(result).toBeDefined();

    const module = await import(join(testdirPath, "dist/bundle.js"));
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

    const result = await build({
      cacheDir: join(testdirPath, ".vite"),
      configFile: false,
      envFile: false,
      logLevel: "silent",
      root: testdirPath,
      build: {
        emptyOutDir: true,
        lib: {
          entry: join(testdirPath, "transform.js"),
          formats: ["es"],
          fileName: "bundle",
          name: "bundle",
        },
        outDir: join(testdirPath, "dist"),
        minify: false,
      },
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

    if (!Array.isArray(result)) {
      expect.fail("result is not an array");
    }

    expect(result).toBeDefined();

    const module = await import(join(testdirPath, "dist/bundle.js"));
    expect(Object.keys(module)).toEqual(["config"]);

    expect(module.config).toEqual({
      this: "transformed",
    });
  });
});
