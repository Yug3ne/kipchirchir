// Renders the app to static HTML and injects it into dist/index.html.
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const ssrDir = resolve(root, "dist-ssr");

const { render } = (await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href));

const template = await readFile(resolve(dist, "index.html"), "utf8");
if (!template.includes("<!--app-html-->")) {
  throw new Error("dist/index.html is missing the <!--app-html--> placeholder");
}
// Preload the fonts used above the fold
const assets = await readdir(resolve(dist, "assets"));
const preloads = assets
  .filter((f) => /^(inter-latin-wght|instrument-serif-latin-400-italic)-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

const html = template
  .replace("<!--app-html-->", render())
  .replace("</title>", `</title>\n    ${preloads}`);
await writeFile(resolve(dist, "index.html"), html);
await rm(ssrDir, { recursive: true, force: true });

console.log(`prerendered dist/index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
