declare module "*.toml" {
  const value: Record<string, unknown>;
  export default value;
}

declare module "*.toml?raw" {
  const value: string;
  export default value;
}
