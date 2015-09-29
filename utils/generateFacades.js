var fs = require('fs')

function generateFacades (sources, path) {
  console.log('Generate facades', path)
  sources.modules.forEach(function (module) {
    var functions = sources.byModule[module].map(function (src) {
      return `${src.name}: require('./${module}/${src.name}')`
    }).join(',\n  ')
    fs.writeFileSync(path + module + '.js', facade(module, functions))
  })
  var facades = sources.modules.map(function (module) {
    return `${module}: require('./${module}.js')`
  }).join(',\n  ')
  fs.writeFileSync(path + 'tonal.js', facade('tonal', facades))
}

module.exports = generateFacades

function facade (name, functions) {
  return `
// ${name} facade
// This code is generated automatically. Don't edit
module.exports = {
  ${functions}
}
`
}
