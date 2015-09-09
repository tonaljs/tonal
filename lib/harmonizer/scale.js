'use strict'

var harmonizer = require('./harmonizer')
var data = require('./scales-all.json')

/**
 * Create a scale
 *
 * @param {String} name - the scale name
 */
function scale (name, tonic) {
  return tonic ? harmonizer(data[name])(tonic) : data[name]
}

var names = null

scale.names = function () {
  names = names || Object.keys(data)
  return names
}

module.exports = scale
