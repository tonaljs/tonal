import json from "rollup-plugin-json";
import buble from "rollup-plugin-buble";

export default {
  output: {
    file: "build/transpiled.js",
    format: "cjs"
  },
  preferConst: false,
  plugins: [
    json({
      preferConst: false
    }),
    buble()
  ]
};
