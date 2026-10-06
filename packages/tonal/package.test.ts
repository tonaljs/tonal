import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const packagesDir = join(__dirname, "..");

describe("package entry points", () => {
  const names = readdirSync(packagesDir).filter((name) =>
    existsSync(join(packagesDir, name, "package.json")),
  );

  test.each(names)("%s main, module and types exist after build", (name) => {
    const dir = join(packagesDir, name);
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    const missing = [pkg.main, pkg.module, pkg.types].filter(
      (file) => !existsSync(join(dir, file)),
    );
    expect(missing).toEqual([]);
  });
});
