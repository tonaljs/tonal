'use strict'

var harmonizer = require('./harmonizer')
var data = require('./chords-all.json')

/**
 * Get a chord with a given name
 *
 * @param {String} name - the chord name
 * @param {String} tonic - (Optional) the tonic pitch
 * @return {Array} an array of intervals or notes (if the tonic is provided)
 */
function chord (name, tonic) {
  return tonic ? harmonizer(data[name])(tonic) : data[name]
}

var names = null
chord.names = function () {
  names = names || Object.keys(data)
  return names
}

module.exports = chord
