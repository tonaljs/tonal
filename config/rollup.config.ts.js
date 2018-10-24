import typescript from "rollup-plugin-typescript2";

export default {
  input: "index.ts",
  output: [
    {
      file: "build/es6.js",
      format: "esm"
    },
    {
      file: "build/es5.js",
      format: "cjs"
    }
  ],
  plugins: [
    typescript({
      typescript: require("typescript"),
      abortOnError: false
    })
  ]
};
