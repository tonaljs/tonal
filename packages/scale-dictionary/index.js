'use strict'

var data = require('./scales.json')

/**
 * A scale dictionary. It's a hashmap of scale names mapped to an array of
 * intervals in shorthand notation or a string with other name (if it's an
 * alias)
 *
 * @name scales
 * @type {HashMap}
 *
 * @example
 * var scales = require('scale-dictionary')
 * scales['Maj7'] // => ['1', '3', '5', '7']
 * scale['maj7'] // => 'Maj7' (an alias)
 * Object.keys(scales) // all scale names
 */
module.exports = Object.keys(data).reduce(function (scales, key) {
  scales[key] = data[key][0].split(' ')
  if (data[key][1]) {
    data[key][1].forEach(function (name) { scales[name] = key })
  }
  return scales
}, {})
