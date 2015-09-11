'use strict'

var transpose = require('../pitch/transpose')
var parse = require('./parse')
var set = require('../set/pitchSet')
var data = require('./scales-all.json')

/**
 * Given a scale name, returns its pitches or intervals
 *
 * @param {String} name - the scale name
 * @return {Array} an array of intervals or notes (if tonic is present)
 */
function scale (name) {
  name = parse(name)
  if (!name) return null
  else if (!name.tonic) return data[name.type]
  else return set(notes(name.tonic, data[name.type]))
}

function notes (tonic, intervals) {
  if (!intervals) return null
  return intervals.split(' ').map(transpose(tonic))
}

module.exports = scale
