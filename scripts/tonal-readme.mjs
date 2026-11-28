// Write packages/tonal/README.md, the README of the `tonal` npm package, from
// the README of the repository.
//
// npm shows the package README on npmjs.com, where the repository's relative
// links (`/packages/scale`, `docs/LICENSE`) don't resolve, so they become
// links to GitHub. Run it in each version PR (see the release steps), after
// `changeset version`.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const GITHUB = "https://github.com/tonaljs/tonal";

const readme = readFileSync(join(root, "README.md"), "utf8")
  // a package folder
  .replace(/\]\(\/?((?:packages|integrations)\/[\w-]+)\/?\)/g, `](${GITHUB}/tree/main/$1)`)
  // a file of the repository
  .replace(/\]\(\/?((?:docs|packages|integrations)\/[^)]+)\)/g, `](${GITHUB}/blob/main/$1)`);

writeFileSync(
  join(root, "packages", "tonal", "README.md"),
  `<!-- generated from README.md by scripts/tonal-readme.mjs: edit that one -->\n\n${readme}`,
);
console.log("tonal-readme: packages/tonal/README.md written");
