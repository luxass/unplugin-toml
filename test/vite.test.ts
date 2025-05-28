import { join } from "node:path";
import { build } from "vite";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import TOMLPlugin from "../src/vite";

describe("handles toml", () => {
  it("expect toml import to be a json object", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      build: {
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

    const firstResult = result[0];

    expect(firstResult).toBeDefined();
    expect(firstResult?.output).toBeDefined();
    expect(firstResult?.output[0]).toBeDefined();
    expect(firstResult?.output[0].code).toBeDefined();
    expect(firstResult?.output[0].code).toMatchSnapshot();
  });

  it("expect toml import to be a string", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      build: {
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

    const firstResult = result[0];

    expect(firstResult).toBeDefined();
    expect(firstResult?.output).toBeDefined();
    expect(firstResult?.output[0]).toBeDefined();
    expect(firstResult?.output[0].code).toBeDefined();
    expect(firstResult?.output[0].code).toMatchSnapshot();
  });
});

it("handle transforms", async () => {
  const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/transform"));

  expect(testdirPath).toBeDefined();

  const result = await build({
    build: {
      lib: {
        entry: join(testdirPath, "transform.js"),
        formats: ["es"],
        fileName: "bundle",
        name: "bundle",
      },
      outDir: join(testdirPath, "dist"),
      minify: false,
    },
    plugins: [TOMLPlugin({
      transform(data) {
        if (data != null && typeof data === "object" && "this" in data) {
          return {
            this: "transformed",
          };
        }
      },
    })],
  });

  if (!Array.isArray(result)) {
    expect.fail("result is not an array");
  }

  expect(result).toBeDefined();

  const firstResult = result[0];

  expect(firstResult).toBeDefined();
  expect(firstResult?.output).toBeDefined();
  expect(firstResult?.output[0]).toBeDefined();
  expect(firstResult?.output[0].code).toBeDefined();
  expect(firstResult?.output[0].code).toMatchSnapshot();
});
