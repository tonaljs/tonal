'use strict'

var chords = require('./data/chords.js')
var main = Object.keys(require('./data/chord-intervals.json'))
var getKeys = require('../_internal/getKeys')

/**
 * Get all known scale names (optionally filtered by a function)
 *
 * The filter function receives an array of intervals and must return true
 * or false
 *
 * @param {Function} filter - the filter function
 * @param {boolean} exclude alias - (Optional) if true, returned list won't
 * include aliases names
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['maj7', 'm7', ....]
 */
module.exports = getKeys(main, chords)
