import json from "rollup-plugin-json";

export default {
  output: {
    file: "build/transpiled.js",
    format: "cjs"
  },
  preferConst: false,
  plugins: [
    json({
      preferConst: false
    })
  ]
};
