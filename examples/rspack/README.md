# Rspack + TOML

Plain HTML/CSS example for `unplugin-toml` with Rspack.

## Get started

```bash
pnpm install
pnpm --filter @unplugin-toml/rspack dev
```

## Build

```bash
pnpm --filter @unplugin-toml/rspack build
```

The page is mounted from `src/main.ts`, imports `config.toml` and `config.toml?raw`, and renders both without a UI framework.
