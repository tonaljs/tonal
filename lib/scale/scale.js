'use strict'

var harmonizer = require('../harmonizer/harmonizer')
var parse = require('./parse')
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
  else return harmonizer(data[name.type])(name.tonic)
}

module.exports = scale
