// Check what typical imports of tonal weigh in an app's bundle (after build).
//
// Each entry is bundled with esbuild from the built packages, minified as ESM,
// and compared with its limit in scripts/size-limits.json (minified bytes). A
// bundler can only drop the modules an app doesn't use when the packages are
// side-effect free ("sideEffects": false in every package.json): without it,
// `import { Note } from "tonal"` takes almost half of tonal.
//
// Usage: node scripts/check-size.mjs           # check against the limits
//        node scripts/check-size.mjs --update  # write the current sizes + 10% as limits
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const limitsFile = join(root, "scripts", "size-limits.json");

const ENTRIES = {
  'import { Note } from "tonal"': 'import { Note } from "tonal"; console.log(Note.get("C4"));',
  'import { Interval } from "tonal"': 'import { Interval } from "tonal"; console.log(Interval.get("P5"));',
  'import { Chord } from "tonal"': 'import { Chord } from "tonal"; console.log(Chord.get("Cmaj7"));',
  'import { Scale } from "tonal"': 'import { Scale } from "tonal"; console.log(Scale.get("C major"));',
  'import { Key } from "tonal"': 'import { Key } from "tonal"; console.log(Key.majorKey("C"));',
  'import { Progression } from "tonal"': 'import { Progression } from "tonal"; console.log(Progression.fromRomanNumerals("C", ["IIm7", "V7"]));',
  'import { Chart } from "tonal"': 'import { Chart } from "tonal"; console.log(Chart.parse("| C |"));',
  'import { Voicing } from "tonal"': 'import { Voicing } from "tonal"; console.log(Voicing.get("Cmaj7"));',
  'import * as Tonal from "tonal"': 'import * as Tonal from "tonal"; console.log(Tonal);',
  'import { get } from "@tonaljs/note"': 'import { get } from "@tonaljs/note"; console.log(get("C4"));',
  'import { parse } from "@tonaljs/ireal"': 'import { parse } from "@tonaljs/ireal"; console.log(parse("irealb://"));',
};

async function measure(code) {
  const result = await build({
    stdin: { contents: code, resolveDir: root, loader: "js" },
    bundle: true,
    minify: true,
    format: "esm",
    platform: "browser",
    write: false,
    logLevel: "silent",
  });
  const bytes = result.outputFiles[0].contents;
  return { min: bytes.length, gzip: gzipSync(bytes, { level: 9 }).length };
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const sizes = {};
for (const [name, code] of Object.entries(ENTRIES)) sizes[name] = await measure(code);

if (process.argv.includes("--update")) {
  const limits = Object.fromEntries(
    Object.entries(sizes).map(([name, s]) => [name, Math.ceil((s.min * 1.1) / 100) * 100]),
  );
  writeFileSync(limitsFile, JSON.stringify(limits, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(limits).length} limits to scripts/size-limits.json`);
}

const limits = JSON.parse(readFileSync(limitsFile, "utf8"));
let failed = 0;
for (const [name, s] of Object.entries(sizes)) {
  const limit = limits[name];
  const over = limit !== undefined && s.min > limit;
  if (over) failed++;
  console.log(
    `${over ? "FAIL" : "ok  "}  ${kb(s.min).padStart(9)}  ${kb(s.gzip).padStart(8)} gzip  ${limit === undefined ? "(no limit)" : `limit ${kb(limit)}`}  ${name}`,
  );
}
if (failed) {
  console.error(`\n${failed} import(s) over their limit. If the growth is expected, run: node scripts/check-size.mjs --update`);
  process.exit(1);
}
