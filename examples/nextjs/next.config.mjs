import TomlPlugin from "unplugin-toml/webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      TomlPlugin(),
    );

    return config;
  },
};

export default nextConfig;
