import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

export default {
  input: "./dist/index.js",
  output: {
    format: "iife",
    file: "./browser/tonal.min.js",
    name: "Tonal",
    sourcemap: true
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    terser(),
    filesize()
  ]
};
