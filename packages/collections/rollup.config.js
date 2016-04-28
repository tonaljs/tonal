import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'lib/index.js',
  format: 'cjs',
  plugins: [ json(), babel() ],
  dest: 'dist/index.js'
}
