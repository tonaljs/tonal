'use strict'

var scales = require('./data/scales.js')
var main = Object.keys(require('./data/scale-intervals.json'))
var getKeys = require('../_internal/getKeys')

/**
 * Get all known scale names (optionally filtered by a function)
 *
 * The filter function receives an array of intervals and must return true
 * or false
 *
 * @param {Function} filter - the filter function
 * @param {boolean} exclude alias - (Optioal) if true, returned list won't
 * include aliases names
 * @return {Array} array with all the known names
 *
 * @example
 * names() => ['major', 'minor', ....]
 */
module.exports = getKeys(main, scales)
