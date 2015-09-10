'use strict'

var toIntervals = require('./intervals')
var transpose = require('../pitch/transpose')

/**
 * Create an harmonizer from a interval list: a function that returns an array of notes
 * from a note
 *
 * @param {Array|String|Integer} intervals - the intervals to use
 * @return {Function} the harmonizer function
 */
function harmonizer (source) {
  var intervals = toIntervals(source)

  return function (tonic) {
    return intervals ? intervals.map(transpose(tonic)) : null
  }
}

module.exports = harmonizer
