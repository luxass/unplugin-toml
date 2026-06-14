# Vite + TOML

Plain HTML/CSS example for `unplugin-toml` with Vite.

## Get started

```bash
pnpm install
pnpm --filter @unplugin-toml/vite dev
```

## Build

```bash
pnpm --filter @unplugin-toml/vite build
```

The page is mounted from `src/main.ts`, imports `config.toml` and `config.toml?raw`, and renders both without a UI framework.
