var join = require('path').join

var sourceModel = require('./sourceModel')
var moduleDocs = require('./generate-module-docs')
var docIndex = require('./generate-doc-index')

var MODULES = ['pitch', 'interval', 'set', 'scale', 'chord', 'key', 'fifths']
var model = sourceModel(MODULES, path('lib'))

moduleDocs(MODULES, path('lib'), path('docs'))
docIndex(model, path('docs/INDEX.md'))

function path (dir) {
  var args = Array.prototype.slice.call(arguments)
  return join.apply(null, [__dirname, '../'].concat(args))
}
