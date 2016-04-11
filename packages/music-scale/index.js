'use strict'

var set = require('pitch-set')
var harmonizer = require('note-harmonizer')
var data = require('scale-dictionary')
var regex = require('music-notation/note/regex')

/**
 * Create a scale from a name or intervals and tonic
 *
 * @namespace scale
 * @name scale
 * @function
 * @param {Array} source - the scale name, scale intervals or scale notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * var scale = require('music-scale')
 * // get scale from type and tonic
 * scale('major', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
 * // get scale from intervals and tonic
 * scale('1 2 3 4 5 6 7', 'A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * // partially applied
 * var major = scale('major')
 * major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * major('A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
 * // part of tonal
 * tonal.scale('major', 'A')
 */
function scale (source, tonic) {
  if (arguments.lenght === 1) return function (t) { return scale(source, t) }
  var intervals = data[source]
  if (typeof intervals === 'string') intervals = data[intervals]
  if (!intervals) intervals = set(source)
  return harmonizer(intervals, tonic)
}

/**
 * Get scale notes by scale name
 *
 * @name get
 * @memberof scale
 * @param {String} name - the complete scale name (with tonic)
 * @return {Array} scale notes
 *
 * @example
 * // get scale from name
 * scale.get('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * // part of tonal
 * tonal.scale.get('C2 bebop')
 */
scale.get = function (name) {
  var p = regex.exec(name)
  return (p && p[5]) ? scale(p[5], p[1] + p[2] + p[3]) : []
}

/**
 * Return the available scale names
 *
 * @name names
 * @memberof scale
 * @function
 * @param {boolean} aliases - true to include aliases
 *
 * @example
 * tonal.scale.names() // => ['maj7', ...]
 */
scale.names = function (aliases) {
  if (aliases) return Object.keys(data)
  return Object.keys(data).reduce(function (names, name) {
    if (typeof data[name] !== 'string') names.push(name)
    return names
  }, [])
}

module.exports = scale
