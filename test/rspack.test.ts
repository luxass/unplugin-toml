import type { Configuration } from "@rspack/core";
import { join } from "node:path";
import { dedent } from "@luxass/utils";
import { rspack as createRspack } from "@rspack/core";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import TOMLPlugin from "../src/rspack";

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
      },
      mode: "production",
      ...config,
      experiments: {
        outputModule: true,
        rspackFuture: {
          // disables the bundler info
          bundlerInfo: {
            force: false,
          },
        },
      },
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      if (!stats) {
        reject(new Error("rspack stats not available"));
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

    await rspack({
      entry: join(testdirPath, "basic.js"),
      plugins: [
        TOMLPlugin(),
      ],
    }, testdirPath);

    const config = await import(join(testdirPath, "dist/bundle.js")).then((m) => m.config);
    expect(config).toBeDefined();

    expect(config).toEqual({
      pluginDir: "./plugins",
      web: { enabled: true },
      logging: { type: "stdout", level: "info" },
    });
  });

  it("expect toml import to be a string", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    await rspack({
      entry: join(testdirPath, "basic-raw.js"),
      plugins: [
        TOMLPlugin(),
      ],
    }, testdirPath);

    const config = await import(join(testdirPath, "dist/bundle.js")).then((m) => m.config);
    expect(config).toBeDefined();

    expect(config).toMatch(dedent`
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

    await rspack({
      entry: join(testdirPath, "transform.js"),
      plugins: [
        TOMLPlugin({
          transform(data) {
            if (data != null && typeof data === "object" && "this" in data) {
              return {
                this: "transformed",
              };
            }
          },
        }),
      ],
    }, testdirPath);

    const config = await import(join(testdirPath, "dist/bundle.js")).then((m) => m.config);
    expect(config).toBeDefined();

    expect(config).toEqual({
      this: "transformed",
    });
  });
});
