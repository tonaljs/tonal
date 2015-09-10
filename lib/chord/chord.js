'use strict'

var harmonizer = require('../harmonizer/harmonizer')
var parse = require('./parse')
var data = require('./chords-all.json')

/**
 * Get a chord with a given name
 *
 * @param {String} tonic - (Optional) the tonic pitch
 * @param {String} name - the chord name
 * @return {Array} an array of intervals or notes (if the tonic is provided)
 */
function chord (name) {
  name = parse(name)
  if (!name) return null
  else if (!name.tonic) return data[name.type]
  else return harmonizer(data[name.type])(name.tonic)
}

module.exports = chord
