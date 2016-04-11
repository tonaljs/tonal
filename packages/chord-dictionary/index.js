'use strict'

var data = require('./chords.json')

/**
 * A chord dictionary. It's a hashmap of names mapped to an array of
 * intervals in shorthand notation or a string with other name (if it's an
 * alias)
 *
 * @name chords
 * @type {HashMap}
 *
 * @example
 * var chords = require('chord-dictionary')
 * chords['Maj7'] // => ['1', '3', '5', '7']
 * chord['maj7'] // => 'Maj7' (an alias)
 * Object.keys(chords) // all chord names
 */
module.exports = Object.keys(data).reduce(function (chords, key) {
  chords[key] = data[key][0].split(' ')
  if (data[key][1]) {
    data[key][1].forEach(function (name) { chords[name] = key })
  }
  return chords
}, {})
