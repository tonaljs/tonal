import json from "rollup-plugin-json";

export default {
  output: {
    file: "build/index.js",
    format: "cjs"
  },
  preferConst: false,
  plugins: [
    json({
      preferConst: false
    })
  ]
};
