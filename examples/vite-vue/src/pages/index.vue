<script setup lang="ts">
import { codeToHtml } from "shiki";

import config from "../config.toml";

const html = await codeToHtml(JSON.stringify(config, null, 2), {
  lang: "json",
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
});
</script>

<template>
  <div v-html="html" />
</template>
