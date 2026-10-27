// Run once the production domain is confirmed:
//   node scripts/finalize-seo.mjs https://www.yourdomain.com
// Adds canonical URLs, og:url, og:image/twitter:image and JSON-LD url to every indexable page,
// writes sitemap.xml, and adds the Sitemap line to robots.txt. Safe to run again (it replaces its own tags).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = process.argv[2];
if (!arg || !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\/?$/i.test(arg) || /localhost|vercel\.app|example\./i.test(arg)) {
  console.error("Usage: node scripts/finalize-seo.mjs https://www.yourdomain.com  (the confirmed production domain, not a preview URL)");
  process.exit(1);
}
const origin = arg.replace(/\/$/, "");
const ogImage = `${origin}/assets/images/og-bookkeeping-services-genesis-solomon.jpg`;
const skipDirs = new Set([".git", "node_modules", "scripts", "docs", "assets"]);

const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name === "index.html") pages.push(p);
  }
};
walk(root);

const urls = [];
for (const file of pages.sort()) {
  let html = readFileSync(file, "utf8");
  const NL = html.includes("\r\n") ? "\r\n" : "\n";
  const rel = relative(root, file).replace(/\\/g, "/");
  const path = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`;
  const url = `${origin}${path}`;
  const indexable = !/<meta name="robots" content="[^"]*noindex/.test(html);
  html = html.replace(/\s*<link rel="canonical" href="[^"]*">/g, "")
    .replace(/\s*<meta property="og:(?:url|image)(?::alt)?" content="[^"]*">/g, "")
    .replace(/\s*<meta name="twitter:image" content="[^"]*">/g, "");
  const tags = [
    indexable ? `<link rel="canonical" href="${url}">` : null,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta property="og:image:alt" content="Genesis Solomon, bookkeeping services for small businesses">`,
    `<meta name="twitter:image" content="${ogImage}">`,
  ].filter(Boolean).map((t) => `    ${t}`).join(NL);
  html = html.replace(/ *<meta name="twitter:card" content="[^"]*">/, (m) => `${m}${NL}${tags}`);
  // Give the structured data an absolute url.
  html = html.replace(/(<script type="application\/ld\+json" data-seo>\s*\{)(\s*)("@context")/, (m, open, space, ctx) =>
    m.includes(`"url"`) ? m : `${open}${space}"url": "${url}",${space}${ctx}`);
  html = html.replace(/"url": "https?:\/\/[^"]*",(\s*"@context")/, (m, rest) => `"url": "${url}",${rest}`);
  writeFileSync(file, html);
  if (indexable) urls.push(url);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(root, "sitemap.xml"), [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`),
  `</urlset>`, "",
].join("\n"));

let robots = readFileSync(join(root, "robots.txt"), "utf8").replace(/\nSitemap: .*\n?/g, "\n").trimEnd();
writeFileSync(join(root, "robots.txt"), `${robots}\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Updated ${pages.length} pages; sitemap.xml lists ${urls.length} indexable URLs for ${origin}`);
