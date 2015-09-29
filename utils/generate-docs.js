var fs = require('fs')
var join = require('path').join

var sourceModel = require('./sourceModel')
var MODULES = ['pitch', 'interval', 'collection', 'scale', 'chord', 'binaryScale', 'key', 'fifths']
var sources = sourceModel(path('lib'), MODULES)

var mdINDEX = require('./mdINDEX')
var mdALL = require('./mdALL')

function path (dir) {
  var args = Array.prototype.slice.call(arguments)
  return join.apply(null, [__dirname, '../'].concat(args))
}

fs.writeFileSync(path('docs', 'INDEX.md'), mdINDEX(sources))
fs.writeFileSync(path('docs/DOCUMENTATION.md'), mdALL(sources))

MODULES.forEach(function (module) {
  var functions = sources.byModule[module].map(function (src) {
    return `${src.name}: require('./${module}/${src.name}')`
  }).join(',\n  ')
  fs.writeFileSync(path('lib', module + '.js'), facade(module, functions))
})
var facades = MODULES.map(function (module) {
  return `${module}: require('./${module}.js')`
}).join(',\n  ')
fs.writeFileSync(path('lib/tonal.js'), facade('tonal', facades))

function facade (name, functions) {
  return `
// ${name} facade
// This code is generated automatically. Don't edit
module.exports = {
  ${functions}
}
`
}
