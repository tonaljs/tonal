import json from 'rollup-plugin-json'

export default {
  format: 'cjs',
  preferConst: false,
  plugins: [
    json({
      preferConst: false
    })
  ]
}
