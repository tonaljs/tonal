'use strict'

var NAMES = ['d1', 'P1', 'A1', 'd2', 'm2', 'M2', 'A2', 'd3', 'm3', 'M3', 'A3',
  'd4', 'P4', 'A4', 'd5', 'P5', 'A5', 'd6', 'm6', 'M6', 'A6',
  'd7', 'm7', 'M7', 'A7', 'd8', 'P8', 'A8']
var DIST_TO_NAMES = { '-1': ['d1'], '0': ['P1', 'd2'], '1': ['A1', 'm2'],
  '2': ['M2', 'd3'], '3': ['A2', 'm3'], '4': ['M3', 'd4'], '5': ['A3', 'P4'],
  '6': ['A4', 'd5'], '7': ['P5', 'd6'], '8': ['A5', 'm6'], '9': ['M6', 'd7'],
  '10': ['A6', 'm7'], '11': ['M7', 'd8'], '12': ['A7', 'P8'], '13': ['A8'] }

/**
 * Get a list of intervals names filtered by the size in semitones
 *
 * @param {Integer} distance - distance of the intervals in semitones
 * @return {Array} - a list of interval names
 *
 * @example
 * var intervalNames = require('tonal/interval-names')
 * intervalNames(7) // => ['P5', 'd6']
 */
function intervalNames (distance) {
  if (distance === undefined) return NAMES
  var abs = Math.abs(distance)
  var octaves = Math.floor(abs / 12)
  var mod = distance < 0 ? '-' : ''
  return DIST_TO_NAMES[abs % 12].map(function (name) {
    return name[0] + mod + (+name[1] + 7 * octaves)
  })
}

module.exports = intervalNames
