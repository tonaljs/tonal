// Publishes the versions committed on main to npm: `npm run release`.
// Version bumps go through a PR first (see docs/CONTRIBUTING.md), so this
// refuses to run unless the checkout is exactly origin/main with every
// changeset already applied. That way npm never gets a version git doesn't have.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const run = (cmd, ...args) =>
  execFileSync(cmd, args, { cwd: root, stdio: "inherit" });

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const branch = git("branch", "--show-current");
if (branch !== "main") fail(`Releases are published from main (on ${branch}).`);

if (git("status", "--porcelain"))
  fail("The working tree has changes. Commit them through a PR first.");

git("fetch", "--quiet", "origin", "main");
if (git("rev-parse", "HEAD") !== git("rev-parse", "origin/main"))
  fail("Local main is not origin/main. Run `git pull` first.");

const pending = readdirSync(join(root, ".changeset")).filter(
  (file) => file.endsWith(".md") && file !== "README.md",
);
if (pending.length)
  fail(
    `Unreleased changesets: ${pending.join(", ")}.\n` +
      "  Run `npx changeset version` on a branch and merge it through a PR first.",
  );

run("npm", "run", "build");
run("npm", "run", "test:run");
run("npm", "run", "test:dist");
run("npx", "changeset", "publish");
run("git", "push", "origin", "--tags");
