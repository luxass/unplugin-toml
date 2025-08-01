import type { Configuration } from "webpack";
import { join } from "node:path";
import { dedent } from "@luxass/utils";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import { webpack as createWebpack } from "webpack";
import TOMLPlugin from "../src/webpack";

async function webpack(config: Configuration, testdirPath: string): Promise<null> {
  return new Promise((resolve, reject) => {
    const compiler = createWebpack({
      optimization: {
        minimize: true,
        usedExports: false,
      },
      experiments: {
        outputModule: true,
      },
      output: {
        library: {
          type: "module",
        },
        path: join(testdirPath, "dist"),
        filename: "bundle.js",
      },
      mode: "production",
      ...config,
    });

    if (compiler == null) {
      throw new Error("webpack compiler is not defined");
    }

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      if (!stats) {
        reject(new Error("webpack stats not available"));
        return;
      }

      resolve(null);
    });
  });
}

describe("webpack", () => {
  it("expect toml import to be a json object", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    await webpack({
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

    await webpack({
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

    await webpack({
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
