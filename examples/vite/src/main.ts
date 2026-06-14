import config from "./config.toml";
import rawConfig from "./config.toml?raw";
import "./styles/globals.css";

interface SummaryItem {
  label: string;
  value: unknown;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const stringifyValue = (value: unknown) => {
  if (typeof value === "string") return value;
  if (value == null) return "null";
  if (typeof value === "object") return JSON.stringify(value, null, 2);

  return String(value);
};

const renderSummaryItem = ({ label, value }: SummaryItem) => `
  <div class="summary-item">
    <dt>${escapeHtml(label)}</dt>
    <dd>${escapeHtml(stringifyValue(value))}</dd>
  </div>
`;

const toId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const renderCodeBlock = (label: string, code: string, language: string) => {
  const headingId = `${toId(label)}-heading`;

  return `
    <section class="code-panel" aria-labelledby="${headingId}">
      <div class="panel-header">
        <p>${escapeHtml(language)}</p>
        <h2 id="${headingId}">${escapeHtml(label)}</h2>
      </div>
      <pre><code>${escapeHtml(code)}</code></pre>
    </section>
  `;
};

const summary = Object.entries(config).map(([label, value]) => ({ label, value }));
const root = document.querySelector<HTMLDivElement>("#root");

if (root == null) {
  throw new Error("Missing #root element");
}

root.innerHTML = `
  <div class="page-shell">
    <header class="hero">
      <p class="eyebrow">Vite example</p>
      <h1>TOML imports, no framework required.</h1>
      <p>
        This page is mounted by plain TypeScript. It imports <code>config.toml</code>
        as a parsed module and <code>config.toml?raw</code> as the original source.
      </p>
    </header>

    <main class="content-grid">
      <section class="summary-card" aria-labelledby="summary-heading">
        <div>
          <p class="eyebrow">Parsed module</p>
          <h2 id="summary-heading">Top-level TOML keys</h2>
        </div>
        <dl class="summary-list">
          ${summary.map(renderSummaryItem).join("")}
        </dl>
      </section>

      ${renderCodeBlock("JSON output", JSON.stringify(config, null, 2), "import config from './config.toml'")}
      ${renderCodeBlock("Raw TOML", rawConfig, "import rawConfig from './config.toml?raw'")}
    </main>
  </div>
`;
