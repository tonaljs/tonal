'use strict'
var scale = require('./scale')
scale.build = require('./build')
scale.select = require('./select')
scale.modes = require('./modes')
scale.chord = require('./chord')
scale.names = require('./names')

if (typeof module === 'object' && module.exports) module.exports = scale
if (typeof window !== 'undefined') window.scale = scale
