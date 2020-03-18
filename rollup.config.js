import _ from "lodash";
import typescript from "rollup-plugin-typescript2";
import path from "path";

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "index.ts");
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "dist");
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const OUTPUTS = [
  { format: "umd", target: "es5", ext: "" },
  { format: "es", target: "esnext", ext: ".es" }
];

const name = getUmdName(PKG_JSON.name);

export default OUTPUTS.map(output => ({
  input: INPUT_FILE,
  external: [
    ...Object.keys(PKG_JSON.dependencies || {}),
    ...Object.keys(PKG_JSON.peerDependencies || {})
  ],
  output: {
    name,
    file: path.join(OUTPUT_DIR, `index${output.ext}.js`),
    format: output.format,
    sourcemap: true
  },
  plugins: [
    typescript({
      tsconfig: `tsconfig.json`,
      tsconfigOverride: {
        compilerOptions: { target: output.target },
        include: [
          path.join(PACKAGE_ROOT_PATH, "index.ts"),
          path.join(PACKAGE_ROOT_PATH, "src/*.ts")
        ]
      }
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
  const suffix = packageName.slice("@tonaljs/".length);
  return _.startCase(suffix).replace(" ", "");
}
