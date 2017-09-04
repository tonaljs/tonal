import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import uglify from "rollup-plugin-uglify";

export default {
  input: "./packages/core/tonal/index.js",
  output: {
    format: "umd",
    file: "./dist/tonal.min.js",
    name: "Tonal",
    sourcemap: true
  },
  preferConst: false,
  plugins: [
    json({
      preferConst: false
    }),
    resolve({
      main: true,
      jsnext: true,
      module: true
    }),
    uglify()
  ]
};
