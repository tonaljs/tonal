'use strict'

var lookup = require('../_internal/lookup')
var data = require('./chords.json')
var aliases = require('./aliases.json')

/**
 * Get the intervals of a chord name
 *
 * @param {String} name - the chord name
 * @return {Array} the intervals or null if not found
 *
 * @example
 * intervals('Cmaj7') // => ['1P', '3M', '5P', '7M']
 */
module.exports = lookup(data, aliases)
