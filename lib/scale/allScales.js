'use strict'

var keys = require('../_internal/keys')
var scales = require('./scales.json')
var aliases = require('./scale-aliases.json')

/**
 * Get all known scale names
 *
 * @name allScales
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
module.exports = keys(scales, aliases)
