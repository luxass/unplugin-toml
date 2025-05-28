<script setup lang="ts">
import { codeToHtml } from "shiki";

import config from "../config.toml?raw";

const html = await codeToHtml(config, {
  lang: "toml",
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
});
</script>

<template>
  <div v-html="html" />
</template>
