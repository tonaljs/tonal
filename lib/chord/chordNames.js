'use strict'

var keys = require('../_internal/keys')
var scales = require('./chords.json')
var aliases = require('./aliases.json')

/**
 * Get all known scale names
 *
 * @name chordNames
 * @module scale
 *
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
module.exports = keys(scales, aliases)
