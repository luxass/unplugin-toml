import { createRequire } from "node:module";
import { join } from "node:path";

import { dedent } from "@luxass/utils";
import type { Configuration } from "@rspack/core";
import { rspack as createRspack } from "@rspack/core";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";

import TOMLPlugin from "../src/rspack";

const require = createRequire(import.meta.url);
const { version: rspackVersion } = require("@rspack/core/package.json") as { version: string };
const rspackMajor = Number(rspackVersion.split(".")[0]);

async function rspack(config: Configuration, testdirPath: string): Promise<null> {
  return new Promise((resolve, reject) => {
    const compiler = createRspack({
      optimization: {
        minimize: true,
        usedExports: true,
      },
      output: {
        path: join(testdirPath, "dist"),
        filename: "bundle.js",
        library: {
          type: "module",
        },
        module: true,
        // bundlerInfo was promoted from experiments to output in v2.x.
        ...(rspackMajor >= 2 ? { bundlerInfo: { force: false } } : {}),
      },
      // In v1.x, bundlerInfo lived under experiments.rspackFuture.
      ...(rspackMajor < 2
        ? ({ experiments: { rspackFuture: { bundlerInfo: { force: false } } } } as object)
        : {}),
      mode: "production",
      stats: "none",
      infrastructureLogging: {
        level: "none",
      },
      ...config,
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (!stats) {
        reject(new Error("rspack stats not available"));
        return;
      }

      if (stats.hasErrors()) {
        reject(new Error(stats.toString("errors-only")));
        return;
      }

      resolve(null);
    });
  });
}

describe("rspack", () => {
  it("expect toml import to be a json object", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    await rspack(
      {
        entry: join(testdirPath, "basic.js"),
        plugins: [TOMLPlugin()],
      },
      testdirPath,
    );

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

    await rspack(
      {
        entry: join(testdirPath, "basic-raw.js"),
        plugins: [TOMLPlugin()],
      },
      testdirPath,
    );

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

    await rspack(
      {
        entry: join(testdirPath, "transform.js"),
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
      },
      testdirPath,
    );

    const module = await import(join(testdirPath, "dist/bundle.js"));
    expect(Object.keys(module)).toEqual(["config"]);

    expect(module.config).toEqual({
      this: "transformed",
    });
  });
});
