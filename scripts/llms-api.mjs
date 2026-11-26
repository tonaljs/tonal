// Generate llms-api.txt: every function of the `tonal` package with its
// signature, the shape of what it returns and a one-line description, in a
// plain-text format meant for coding agents (LLMs).
//
// The source of truth is the TypeScript source: the signatures come from the
// types and the descriptions from the JSDoc comments. The file is committed as
// packages/tonal/llms-api.txt (shipped in the npm package and copied to the
// docs site), so a PR that changes the public API shows the change in it.
//
//   node scripts/llms-api.mjs           write packages/tonal/llms-api.txt
//   node scripts/llms-api.mjs --check   fail if the file is out of date or a
//                                       public function has no description
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packages = join(root, "packages");
const OUTPUT = join(packages, "tonal", "llms-api.txt");

// Namespaces of `tonal` that only exist for backwards compatibility.
const DEPRECATED_NAMESPACES = {
  ChordDictionary: "ChordType",
  PcSet: "Pcset",
  ScaleDictionary: "ScaleType",
  VoicingDictionary:
    "Voicing (get, search and sequence with options or templates)",
  Tonal: "the top-level functions",
};
// `Core` is the same as the top-level functions, which are listed once.
const SKIP_NAMESPACES = new Set(["Core"]);

// Low-level helpers of @tonaljs/core that are exported but not meant for users.
const INTERNAL = new Set(["fillStr", "deprecate"]);

const TYPE_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType |
  ts.TypeFormatFlags.WriteArrowStyleSignature;

function createProgram() {
  return ts.createProgram([join(packages, "tonal", "index.ts")], {
    strict: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    // resolve the packages to their source, not to their built dist/
    paths: { "@tonaljs/*": [join(packages, "*", "index.ts")] },
    noEmit: true,
  });
}

/** The package directory name of a source file ("chord" for packages/chord/x.ts) */
function packageOf(fileName) {
  const rel = relative(packages, fileName);
  return rel.startsWith("..") ? undefined : rel.split(/[/\\]/)[0];
}

function generate() {
  const program = createProgram();
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(join(packages, "tonal", "index.ts"));
  const tonal = checker.getSymbolAtLocation(entry);
  const version = JSON.parse(
    readFileSync(join(packages, "tonal", "package.json"), "utf8"),
  ).version;

  const resolve = (symbol) =>
    symbol.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;

  const namespaces = [];
  const topLevel = [];
  for (const exported of checker.getExportsOfModule(tonal)) {
    const name = exported.getName();
    const target = resolve(exported);
    if (target.flags & ts.SymbolFlags.Module) {
      namespaces.push({ name, module: target });
    } else if (!DEPRECATED_NAMESPACES[name]) {
      topLevel.push(exported);
    }
  }

  const missing = [];
  const sections = [];

  // the top-level functions come from @tonaljs/core
  sections.push(
    section(
      {
        title: "Top-level functions",
        importLine: `import { note, interval, transpose, distance } from "tonal";`,
        prefix: "",
        symbols: topLevel,
      },
      checker,
      resolve,
      missing,
    ),
  );

  for (const { name, module } of namespaces.sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (SKIP_NAMESPACES.has(name) || DEPRECATED_NAMESPACES[name]) continue;
    const file = module.declarations?.[0]?.getSourceFile().fileName;
    const pkg = packageOf(file);
    sections.push(
      section(
        {
          title: name,
          importLine: `import { ${name} } from "tonal"; // or: import * as ${name} from "@tonaljs/${pkg}";`,
          prefix: `${name}.`,
          symbols: checker
            .getExportsOfModule(module)
            .filter((s) => s.getName() !== "default"),
        },
        checker,
        resolve,
        missing,
      ),
    );
  }

  const deprecatedNamespaces = Object.entries(DEPRECATED_NAMESPACES)
    .map(([name, alt]) => `- ${name}: use ${alt}`)
    .join("\n");

  const text = `# tonal ${version} API

Every public function of the \`tonal\` npm package, generated from its
TypeScript source. One entry per function: the signature, then a one-line
description, then an example when there is one. The types that functions
return are listed after the functions of each module.

Conventions:
- All functions are pure. Nothing mutates its arguments.
- Invalid input does not throw: functions return an object with
  \`empty: true\`, an empty string \`""\`, an empty array, or null/undefined
  (see each signature). Check for it.
- Notes are strings like "C4", "Eb5", "F#" (a note without octave is a pitch
  class). Intervals are strings like "3M", "5P", "-2m" ("M3" and "P5" are also
  accepted).
- Functions marked [deprecated] still work but must not be used in new code.

Guide for agents: https://tonaljs.github.io/tonal/docs/agents.md
Index: https://tonaljs.github.io/tonal/llms.txt

${sections.join("\n\n")}

## Deprecated namespaces

${deprecatedNamespaces}
`;
  return { text, missing };
}

function section(
  { title, importLine, prefix, symbols },
  checker,
  resolve,
  missing,
) {
  const functions = [];
  const constants = [];
  const types = new Map();

  for (const exported of symbols.sort((a, b) =>
    a.getName().localeCompare(b.getName()),
  )) {
    const name = exported.getName();
    if (INTERNAL.has(name)) continue;
    const symbol = resolve(exported);
    const decl = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (!decl) continue;

    // types and interfaces are listed when a function uses them
    if (!(symbol.flags & ts.SymbolFlags.Value)) continue;

    const type = checker.getTypeOfSymbolAtLocation(symbol, decl);
    const signatures = type.getCallSignatures();
    // An overloaded function can deprecate some of its signatures only: mark
    // those lines, and the whole function only when all of them are.
    const signatureDeprecations = signatures.map(signatureDeprecation);
    const overloaded = signatures.length > 1;
    const deprecated = overloaded
      ? signatureDeprecations.every(Boolean)
        ? signatureDeprecations[0]
        : ""
      : deprecation(symbol, decl, checker);
    const description = describe(symbol, checker);

    if (signatures.length === 0) {
      const text = typeText(type, decl, checker);
      constants.push(
        entry(`${prefix}${name}: ${text}`, description, deprecated, []),
      );
      continue;
    }

    const lines = signatures.map(
      (sig, i) =>
        `${prefix}${name}${clean(checker.signatureToString(sig, decl, TYPE_FLAGS & ~ts.TypeFormatFlags.WriteArrowStyleSignature))}` +
        (overloaded && !deprecated && signatureDeprecations[i]
          ? `  [deprecated] ${signatureDeprecations[i]}`
          : ""),
    );
    for (const sig of signatures) {
      collectTypes(sig.getReturnType(), checker, types);
      for (const param of sig.getParameters()) {
        collectTypes(
          checker.getTypeOfSymbolAtLocation(param, decl),
          checker,
          types,
        );
      }
    }
    if (!description && !deprecated) {
      missing.push(`${prefix || "tonal."}${name}`);
    }
    functions.push(
      entry(lines.join("\n"), description, deprecated, examples(symbol)),
    );
  }

  const parts = [`## ${title}`, "", importLine];
  if (functions.length) parts.push("", functions.join("\n\n"));
  if (constants.length)
    parts.push("", "Constants:", "", constants.join("\n\n"));
  if (types.size) {
    parts.push("", "Types:", "", [...types.values()].sort().join("\n\n"));
  }
  return parts.join("\n");
}

/** Remove `import("...").` qualifiers: every type name is unique in tonal */
function clean(text) {
  return text.replace(/import\("[^"]+"\)\./g, "");
}

function typeText(type, decl, checker, flags = 0) {
  return clean(checker.typeToString(type, decl, TYPE_FLAGS | flags));
}

function entry(signature, description, deprecated, examples) {
  const lines = [signature];
  if (deprecated) lines.push(`  [deprecated] ${deprecated}`);
  if (description) lines.push(`  ${description}`);
  for (const example of examples) lines.push(`  ${example}`);
  return lines.join("\n");
}

/** The first sentence or paragraph of the JSDoc comment, on one line */
function describe(symbol, checker) {
  const text = ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .trim();
  if (!text) return "";
  const paragraph = text
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, " ")
    .trim();
  return paragraph;
}

/** The @example lines (code only, at most 3) */
function examples(symbol) {
  const lines = [];
  for (const tag of symbol.getJsDocTags()) {
    if (tag.name !== "example") continue;
    const text = ts.displayPartsToString(tag.text);
    for (const line of text.split("\n")) {
      const code = line.replace(/^\s*```\w*\s*$/, "").trimEnd();
      const trimmed = code.trim();
      if (trimmed && !/^(\/\/|import\b)/.test(trimmed)) lines.push(trimmed);
    }
  }
  return lines.slice(0, 3);
}

/** The deprecation note: from a @deprecated tag or a deprecate() wrapper */
/** The @deprecated text of one signature of a function, or "" */
function signatureDeprecation(sig) {
  const tag = sig.getJsDocTags().find((t) => t.name === "deprecated");
  if (!tag) return "";
  const text = ts.displayPartsToString(tag.text).replace(/\s+/g, " ").trim();
  return text || "Deprecated.";
}

function deprecation(symbol, decl, checker) {
  for (const tag of symbol.getJsDocTags(checker)) {
    if (tag.name === "deprecated") {
      const text = ts
        .displayPartsToString(tag.text)
        .replace(/\s+/g, " ")
        .trim();
      return text || "Deprecated.";
    }
  }
  const init = ts.isVariableDeclaration(decl) ? decl.initializer : undefined;
  if (
    init &&
    ts.isCallExpression(init) &&
    init.expression.getText() === "deprecate" &&
    init.arguments.length >= 2
  ) {
    const alternative = init.arguments[1];
    return ts.isStringLiteral(alternative)
      ? `Use ${alternative.text}.`
      : "Deprecated.";
  }
  return "";
}

/**
 * Collect the object types declared in tonal that a type refers to, written as
 * `type Name = { prop: type; ... }` with every property, inherited ones too.
 */
function collectTypes(type, checker, types) {
  const visit = (t) => {
    const alias = t.aliasSymbol;
    const aliasDecl = alias?.declarations?.[0];
    if (
      alias &&
      t.isUnion() &&
      aliasDecl &&
      packageOf(aliasDecl.getSourceFile().fileName) &&
      !types.has(alias.getName())
    ) {
      // a named union, such as type ChordQuality = "Major" | "Minor" | ...
      // With its JSDoc description, which explains a union that names types
      // not listed here (`NoteName = KnownNoteName | (string & {})`)
      const description = describe(alias, checker);
      types.set(
        alias.getName(),
        `type ${alias.getName()} = ${typeText(t, aliasDecl, checker, ts.TypeFormatFlags.InTypeAlias)}` +
          (description ? `\n  ${description}` : ""),
      );
    }
    if (t.isUnion() || t.isIntersection()) return t.types.forEach(visit);
    const args = checker.getTypeArguments?.(t) ?? [];
    if (
      t.symbol?.getName() === "Array" ||
      t.symbol?.getName() === "ReadonlyArray"
    ) {
      return args.forEach(visit);
    }
    if (
      t.objectFlags & ts.ObjectFlags.Reference &&
      t.target?.objectFlags & ts.ObjectFlags.Tuple
    ) {
      return args.forEach(visit);
    }
    const symbol = t.aliasSymbol ?? t.symbol;
    if (!symbol) return;
    const name = symbol.getName();
    const decl = symbol.declarations?.[0];
    if (!decl || !packageOf(decl.getSourceFile().fileName)) return;
    if (types.has(name)) return;
    if (!ts.isInterfaceDeclaration(decl) && !ts.isTypeAliasDeclaration(decl)) {
      return;
    }
    const props = checker.getPropertiesOfType(t);
    if (props.length === 0 || t.getCallSignatures().length) {
      types.set(
        name,
        `type ${name} = ${typeText(t, decl, checker, ts.TypeFormatFlags.InTypeAlias)}`,
      );
      return;
    }
    types.set(name, ""); // placeholder, stops recursion
    const lines = props.map((p) => {
      const pType = checker.getTypeOfSymbolAtLocation(p, decl);
      const optional = p.flags & ts.SymbolFlags.Optional ? "?" : "";
      const readonly = "";
      const dep = p
        .getJsDocTags(checker)
        .some((tag) => tag.name === "deprecated")
        ? " // deprecated"
        : "";
      return `  ${readonly}${p.getName()}${optional}: ${typeText(pType, decl, checker)};${dep}`;
    });
    types.set(name, `type ${name} = {\n${lines.join("\n")}\n}`);
    for (const p of props) {
      visit(checker.getTypeOfSymbolAtLocation(p, decl));
    }
  };
  visit(type);
}

const { text, missing } = generate();

if (process.argv.includes("--check")) {
  let ok = true;
  if (missing.length) {
    ok = false;
    console.error(
      `These public functions have no JSDoc description:\n  ${missing.join("\n  ")}`,
    );
  }
  let current = "";
  try {
    current = readFileSync(OUTPUT, "utf8");
  } catch {
    // missing file
  }
  if (current !== text) {
    ok = false;
    console.error(
      `${relative(root, OUTPUT)} is out of date. Run: npm run docs:api`,
    );
  }
  if (!ok) process.exit(1);
  console.log(`${relative(root, OUTPUT)} is up to date.`);
} else {
  writeFileSync(OUTPUT, text);
  console.log(`Wrote ${relative(root, OUTPUT)}`);
  if (missing.length) {
    console.warn(
      `${missing.length} public functions have no JSDoc description:\n  ${missing.join("\n  ")}`,
    );
  }
}
