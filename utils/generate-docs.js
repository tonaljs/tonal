var join = require('path').join

var moduleDocs = require('./generate-module-docs')
var docIndex = require('./generate-doc-index')

var MODULES = ['pitch', 'interval', 'set', 'scale', 'chord', 'key', 'fifths']

moduleDocs(MODULES, path('lib'), path('docs'))
docIndex(MODULES, path('lib'), path('docs/INDEX.md'))

function path (dir) {
  var args = Array.prototype.slice.call(arguments)
  return join.apply(null, [__dirname, '../'].concat(args))
}
