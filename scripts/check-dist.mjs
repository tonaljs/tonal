// Checks that every package's built entry points resolve and load in Node.
// Run after `npm run build`: `npm run test:dist`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { compileFunction } from "node:vm";

const packagesDir = join(import.meta.dirname, "..", "packages");
const require = createRequire(import.meta.url);

// Node adds a synthetic "module.exports" name to CommonJS modules seen from
// ESM, and `export *` from a dependency carries it along.
const exportNames = (mod) =>
  Object.keys(mod)
    .filter((name) => name !== "module.exports")
    .sort();

// `main` must be CommonJS: newer Node versions would also `require` an ES
// module, so loading it is not enough to prove its format.
function isCommonJS(file) {
  try {
    compileFunction(readFileSync(file, "utf8"), [
      "exports",
      "require",
      "module",
      "__filename",
      "__dirname",
    ]);
    return true;
  } catch {
    return false;
  }
}

async function checkPackage(dir) {
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const errors = [];
  for (const field of ["main", "module", "types"]) {
    if (!pkg[field]) errors.push(`no "${field}" field`);
    else if (!existsSync(join(dir, pkg[field])))
      errors.push(`"${field}" points to missing ${pkg[field]}`);
  }
  if (errors.length) return errors;

  const main = join(dir, pkg.main);
  if (!isCommonJS(main)) return [`"main" (${pkg.main}) is not CommonJS`];

  let cjs, esm;
  try {
    cjs = exportNames(require(main));
    esm = exportNames(await import(pathToFileURL(join(dir, pkg.module))));
  } catch (error) {
    return [`fails to load: ${error.message.split("\n")[0]}`];
  }
  if (cjs.length === 0) errors.push(`"main" (${pkg.main}) exports nothing`);
  if (esm.length === 0) errors.push(`"module" (${pkg.module}) exports nothing`);
  if (cjs.join() !== esm.join())
    errors.push(
      `"main" and "module" export different names: ` +
        `only in main [${cjs.filter((n) => !esm.includes(n))}], ` +
        `only in module [${esm.filter((n) => !cjs.includes(n))}]`,
    );
  return errors;
}

const names = readdirSync(packagesDir).filter((name) =>
  existsSync(join(packagesDir, name, "package.json")),
);

let failed = 0;
for (const name of names) {
  const errors = await checkPackage(join(packagesDir, name));
  if (errors.length) {
    failed++;
    for (const error of errors) console.error(`✗ ${name}: ${error}`);
  }
}

if (failed) {
  console.error(
    `\n${failed} of ${names.length} packages have broken entry points.`,
  );
  process.exit(1);
}
console.log(`✓ ${names.length} packages: main, module and types load.`);
