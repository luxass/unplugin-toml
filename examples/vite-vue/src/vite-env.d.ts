/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="unplugin-toml/types" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent;
  export default component;
}
