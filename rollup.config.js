import _ from "lodash";
import typescript from "rollup-plugin-typescript2";
import path from "path";

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "index.ts");
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "dist");
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const formats = [{ dist: "umd", ts: "es5" }, { dist: "es", ts: "esnext" }];

const name = getUmdName(PKG_JSON.name);

export default formats.map(format => ({
  input: INPUT_FILE,
  external: [
    ...Object.keys(PKG_JSON.dependencies || {}),
    ...Object.keys(PKG_JSON.peerDependencies || {})
  ],
  output: {
    name,
    file: path.join(OUTPUT_DIR, `index.${format.ts}.js`),
    format: format.dist,
    sourcemap: true
  },
  plugins: [
    typescript({
      tsconfig: `tsconfig.json`,
      tsconfigOverride: { compilerOptions: { target: format.ts } }
    })
  ]
}));

function getUmdName(packageName) {
  if (!packageName.startsWith("@tonaljs/")) {
    throw Error(
      "Invalid package name. It should start with `@tonaljs/` but was: " +
        packageName
    );
  }
  const sufix = packageName.slice("@tonaljs/".length);
  return _.startCase(sufix).replace(" ", "");
}
