// Checks that TypeScript resolves every package's types under each module
// resolution mode (node10, node16 from CJS and ESM, bundler), using
// "Are the Types Wrong" on the packed tarball. Run after `npm run build`:
// `npm run test:types`.
import { execFile } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { promisify } from "node:util";

const root = join(import.meta.dirname, "..");
// the packages of tonal and its integrations
const FOLDERS = ["packages", "integrations"].map((f) => join(root, f));
const attw = join(root, "node_modules", ".bin", "attw");

async function checkPackage(dir) {
  let stdout;
  try {
    ({ stdout } = await promisify(execFile)(attw, [
      "--pack",
      dir,
      "--format",
      "json",
    ]));
  } catch (error) {
    // attw exits with 1 when it finds problems; the report is still on stdout
    if (!error.stdout) return [error.message.split("\n")[0]];
    stdout = error.stdout;
  }
  const { analysis, problems } = JSON.parse(stdout);
  // attw accepts a package without types, but every tonal package declares them
  if (analysis.types === false) return ["the packed tarball has no types"];
  return Object.entries(problems).map(([kind, list]) => {
    const modes = [...new Set(list.map((p) => p.resolutionKind))];
    return modes.some(Boolean) ? `${kind} (${modes.join(", ")})` : kind;
  });
}

const names = FOLDERS.filter((folder) => existsSync(folder)).flatMap((folder) =>
  readdirSync(folder)
    .map((name) => join(folder, name))
    .filter((dir) => existsSync(join(dir, "package.json"))),
);

const results = await Promise.all(names.map(checkPackage));

let failed = 0;
names.forEach((name, i) => {
  if (results[i].length === 0) return;
  failed++;
  for (const error of results[i]) {
    console.error(`✗ ${relative(root, name)}: ${error}`);
  }
});

if (failed) {
  console.error(
    `\n${failed} of ${names.length} packages have type problems. ` +
      "Run `npx attw --pack <folder>/<name>` for details.",
  );
  process.exit(1);
}
console.log(`✓ ${names.length} packages: types resolve in every mode.`);
