var join = require('path').join

var ROOT = join(__dirname, '../')
var MODULES = ['pitch', 'interval', 'collection', 'scale', 'chord', 'binaryScale', 'key', 'fifths']

var sourceModel = require('./sourceModel')
var sources = sourceModel(ROOT + 'lib/', MODULES)

var generateDocs = require('./generateDocs')
generateDocs(sources, ROOT + 'docs/')

var generateFacades = require('./generateFacades')
generateFacades(sources, ROOT + 'lib/')
