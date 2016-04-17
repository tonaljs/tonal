import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'dist/jsnext/tonal.js',
  format: 'cjs',
  plugins: [ json(), babel() ],
  dest: 'dist/tonal.js'
}
