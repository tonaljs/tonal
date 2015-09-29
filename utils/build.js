
var sourceModel = require('./sourceModel')
var sources = sourceModel(ROOT)

var generateDocs = require('./generateDocs')
generateDocs(sources, ROOT + 'docs/')

var generateFacades = require('./generateFacades')
generateFacades(sources, ROOT + 'lib/')
