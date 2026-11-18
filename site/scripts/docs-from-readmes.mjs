// Generate the package pages of the docs site from the package READMEs.
//
// The READMEs (packages/*/README.md) are the only source of the package docs.
// For each page of docs-from-readmes.json, this script reads the README,
// removes what only makes sense on npm or GitHub, adds the page frontmatter
// and writes the page to content/docs/. The generated pages are gitignored.
// It runs before `next build` and `next dev` (prebuild and predev).
//
// Links in the READMEs are written for GitHub: `/packages/key` or `../voicing`
// to another package, `./data.ts` to a file of the package. The script turns
// them into links to the site page of that package, or to the file on GitHub.
//
// A page can list `apps` (slugs of site/lib/apps.json): the page starts with a
// link to try them.
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
const apps = JSON.parse(readFileSync(join(site, "lib", "apps.json"), "utf8"));

const GITHUB = "https://github.com/tonaljs/tonal/blob/main/packages";

// the site url of each documented package: the first page of its README
const packageUrls = new Map();
for (const { page, readme } of pages) {
  if (!packageUrls.has(readme)) {
    packageUrls.set(readme, `/docs/${page.replace(/\.md$/, "")}`);
  }
}

// `](/packages/name#hash)` and `](../name#hash)` to the package page,
// `](./file)` to the file on GitHub. Other links are kept.
function siteLinks(line, folder) {
  return line
    .replace(
      /\]\((?:\/packages\/|\.\.\/)([\w-]+)\/?(#[^)]*)?\)/g,
      (link, name, hash = "") => {
        const url = packageUrls.get(name);
        return url ? `](${url}${hash})` : link;
      },
    )
    .replace(
      /\]\(\.\/([^)]+)\)/g,
      (_, file) => `](${GITHUB}/${folder}/${file})`,
    );
}

function tryApps(slugs = []) {
  return slugs.map((slug) => {
    const app = apps.find((app) => app.slug === slug);
    if (!app) throw Error(`docs-from-readmes: unknown app "${slug}"`);
    return `> **Try it:** [${app.title}](/apps/${slug}/). ${app.description}`;
  });
}

// sections that explain how to install or import the package: the site
// explains it once, in its getting started page
const NPM_ONLY_SECTIONS = /^(usage|install|installation)$/i;

function pageFromReadme(readme, page) {
  const { readme: folder, title, description } = page;
  const body = [];
  const intro = tryApps(page.apps);
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
    if (!skipping) body.push(inCode ? line : siteLinks(line, folder));
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
  const content = [intro.join("\n"), body.join("\n").trim()]
    .filter(Boolean)
    .join("\n\n");
  return `${frontmatter.join("\n")}\n\n${content}\n`;
}

for (const page of pages) {
  const readme = readFileSync(join(packages, page.readme, "README.md"), "utf8");
  const target = join(content, page.page);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, pageFromReadme(readme, page));
}
console.log(`docs-from-readmes: ${pages.length} pages generated`);
