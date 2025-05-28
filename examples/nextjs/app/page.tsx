import { codeToHtml } from "shiki";
import config from "./config.toml";

export default async function Home() {
  const html = await codeToHtml(JSON.stringify(config, null, 2), {
    lang: "json",
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });

  return (
    <div dangerouslySetInnerHTML={{
      __html: html,
    }}
    />
  );
}
