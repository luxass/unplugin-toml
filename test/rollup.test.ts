import { join } from "node:path";
import { rollup } from "rollup";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import TOMLPlugin from "../src/rollup";
import { removeComments } from "./utils";

describe("rolldown", () => {
  it("expect toml import to be a json object", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    const bundle = await rollup({
      input: join(testdirPath, "basic.js"),
      plugins: [
        TOMLPlugin(),
      ],
    });
    const { output } = await bundle.generate({
      format: "esm",
      sourcemap: false,
    });

    expect(removeComments(output[0].code)).toMatchSnapshot();
  });

  it("expect toml import to be a string", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/basic"));

    expect(testdirPath).toBeDefined();

    const bundle = await rollup({
      input: join(testdirPath, "basic-raw.js"),
      plugins: [
        TOMLPlugin(),
      ],
    });
    const { output } = await bundle.generate({
      format: "esm",
      sourcemap: false,
    });

    expect(removeComments(output[0].code)).toMatchSnapshot();
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
          },
        }),
      ],
    });
    const { output } = await bundle.generate({
      format: "esm",
      sourcemap: false,
    });

    expect(removeComments(output[0].code)).toMatchSnapshot();
  });
});
