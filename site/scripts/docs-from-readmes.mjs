// Generate the package pages of the docs site from the package READMEs.
//
// The READMEs (packages/*/README.md) are the only source of the package docs.
// For each page of docs-from-readmes.json, this script reads the README,
// removes what only makes sense on npm or GitHub, adds the page frontmatter
// and writes the page to content/docs/. The generated pages are gitignored.
// It runs before `next build` and `next dev` (prebuild and predev).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scripts = dirname(fileURLToPath(import.meta.url));
const site = join(scripts, "..");
const packages = join(site, "..", "packages");
const content = join(site, "content", "docs");
const pages = JSON.parse(
  readFileSync(join(scripts, "docs-from-readmes.json"), "utf8"),
);

// sections that explain how to install or import the package: the site
// explains it once, in its getting started page
const NPM_ONLY_SECTIONS = /^(usage|install|installation)$/i;

function pageFromReadme(readme, page) {
  const { readme: folder, title, description } = page;
  const body = [];
  let skipping = false;
  let inCode = false;
  let started = false;
  for (const line of readme.replace(/\r\n/g, "\n").split("\n")) {
    if (line.startsWith("```")) inCode = !inCode;
    if (!inCode && !line.startsWith("```")) {
      // the title with the badges: the site shows its own title and badge
      if (line.startsWith("# ")) continue;
      // the package name, already in the badge
      if (/^`@tonaljs\/[\w-]+`$/.test(line.trim())) continue;
      // the tagline: the site shows the page description instead (or the
      // tagline as plain text when the page has no description)
      if (!started && line.startsWith("> ")) {
        if (!description) body.push(line.slice(2));
        continue;
      }
      const h2 = line.match(/^## (.*)$/);
      if (h2) skipping = NPM_ONLY_SECTIONS.test(h2[1].trim());
    }
    if (line.trim()) started = true;
    if (!skipping) body.push(line);
  }

  const frontmatter = [
    "---",
    `# generated from packages/${folder}/README.md by site/scripts/docs-from-readmes.mjs`,
    "# don't edit this file: edit the README",
    `title: ${title}`,
  ];
  if (description) frontmatter.push(`description: ${description}`);
  // the npm badge of the page: the package is the README folder
  frontmatter.push(`package: ${folder}`, "---");
  return `${frontmatter.join("\n")}\n\n${body.join("\n").trim()}\n`;
}

for (const page of pages) {
  const readme = readFileSync(join(packages, page.readme, "README.md"), "utf8");
  const target = join(content, page.page);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, pageFromReadme(readme, page));
}
console.log(`docs-from-readmes: ${pages.length} pages generated`);
