var fs = require('fs')
var join = require('path').join

var sourceModel = require('./sourceModel')
var mdINDEX = require('./mdINDEX')
var mdALL = require('./mdALL')

function path (dir) {
  var args = Array.prototype.slice.call(arguments)
  return join.apply(null, [__dirname, '../'].concat(args))
}

var sources = sourceModel(path('lib'),
  ['pitch', 'scale', 'chord', 'interval', 'pitchSet', 'binarySet', 'key', 'fifths'])

fs.writeFileSync(path('docs', 'INDEX.md'), mdINDEX(sources))
fs.writeFileSync(path('docs', 'ALL.md'), mdALL(sources))

var moduleDocs = require('./generate-module-docs')
moduleDocs(sources.modules, path('lib'), path('docs'))
