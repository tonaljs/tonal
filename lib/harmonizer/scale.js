'use strict'

var harmonizer = require('./harmonizer')
var data = require('./scales-all.json')

/**
 * Create a scale
 *
 * @param {String} name - the scale name
 */
function scale (tonic, name) {
  return arguments.length > 1 ? harmonizer(data[name])(tonic) : data[arguments[0]]
}

var names = null

scale.names = function () {
  names = names || Object.keys(data)
  return names
}

module.exports = scale
