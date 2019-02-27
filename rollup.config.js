import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import { uglify } from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";
import buble from "rollup-plugin-buble";

export default [
  {
    input: "./tonal/index.js",
    output: {
      format: "umd",
      file: "./build/dist/tonal.min.js",
      name: "Tonal",
      sourcemap: true
    },
    plugins: [
      json({
        preferConst: false
      }),
      resolve({
        main: true,
        jsnext: true,
        module: true
      }),
      buble(),
      uglify(),
      filesize()
    ]
  }
];
