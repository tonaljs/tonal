'use strict'

var harmonizer = require('./harmonizer')
var data = require('./chords-all.json')

/**
 * Get a chord with a given name
 *
 * @param {String} tonic - (Optional) the tonic pitch
 * @param {String} name - the chord name
 * @return {Array} an array of intervals or notes (if the tonic is provided)
 */
function chord (tonic, name) {
  return arguments.length > 1 ? harmonizer(data[name])(tonic) : data[arguments[0]]
}

var names = null
chord.names = function () {
  names = names || Object.keys(data)
  return names
}

module.exports = chord
