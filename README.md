# unplugin-toml

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Allow import Toml file for Vite, Webpack, Rollup and esbuild. With TypeScript support. Powered by [unplugin](https://github.com/unjs/unplugin).

<p align="center">
<br />
<a href="https://stackblitz.com/github/luxass/unplugin-toml/tree/main/examples/vite-vue?file=vite.config.ts"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" /></a>
</p>

## Install

```bash
npm i -D unplugin-toml
```

## Usage

> [!TIP]
> You can view all examples [here](./examples).

<details>
<summary>Vite</summary><br/>

```ts
// vite.config.ts
import TOMLPlugin from "unplugin-toml/vite";

export default defineConfig({
  plugins: [
    TOMLPlugin({ /* options */ }),
  ],
});
```

<br/></details>

<details>
<summary>Rollup</summary><br/>

```ts
// rollup.config.js
import TOMLPlugin from "unplugin-toml/rollup";

export default {
  plugins: [
    TOMLPlugin({ /* options */ }),
  ],
};
```

<br/></details>

<details>
<summary>Webpack</summary><br/>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-toml/webpack").default({ /* options */ }),
  ],
};
```

<br/></details>

<details>
<summary>Nuxt</summary><br/>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ["unplugin-toml/nuxt", { /* options */ }]
  ],
});
```

<br/></details>

<details>
<summary>Astro</summary><br/>

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import TOMLPlugin from "unplugin-toml/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    TOMLPlugin({
      /* options */
    })
  ]
});
```

<br/></details>

<details>
<summary>esbuild</summary><br/>

```ts
// esbuild.config.js
import { build } from "esbuild";
import TOMLPlugin from "unplugin-toml/esbuild";

build({
  /* ... */
  plugins: [
    TOMLPlugin({
      /* options */
    }),
  ],
});
```

<br/></details>

<details>
<summary>Farm</summary><br/>

```ts
// farm.config.ts
import { defineConfig } from "@farmfe/core";
import vue from "@vitejs/plugin-vue";
import TOMLPlugin from "unplugin-toml/farm";

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  plugins: [
    TOMLPlugin({
      /* options */
    })
  ]
});
```

<br/></details>

<details>
<summary>Rspack</summary><br/>

```ts
// rspack.config.mjs
import rspack from "@rspack/core";
import TOMLPlugin from "unplugin-toml/rspack";

/** @type {import('@rspack/core').Configuration} */
export default {
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html"
    }),
    TOMLPlugin()
  ],
};
```

<br/></details>

<details>
<summary>Rolldown (Experimental)</summary><br/>

```ts
// rolldown.config.js
import { defineConfig } from "rolldown";
import TOMLPlugin from "unplugin-toml/rolldown";

export default defineConfig({
  input: "./index.js",
  plugins: [
    TOMLPlugin({
      /* options */
    }),
  ],
});
```

<br/></details>

## Configuration

```ts
TOMLPlugin({
  include: [
    /\.tomlcustom$/, // .tomlcustom
  ],
  parserOptions: {
    // see toml load options
  }
});
```
### TypeScript

If you are using TypeScript, you need to add the following to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "types": [
      "unplugin-toml/types"
    ]
  }
}
```

## 📄 License

Published under [MIT License](./LICENSE).

[npm-version-src]: https://img.shields.io/npm/v/unplugin-toml?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/unplugin-toml
[npm-downloads-src]: https://img.shields.io/npm/dm/unplugin-toml?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/unplugin-toml
