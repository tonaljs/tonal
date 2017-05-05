import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: './packages/tonal/index.js',
  format: 'umd',
  dest: './dist/tonal.min.js',
  moduleName: 'Tonal',
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
}
