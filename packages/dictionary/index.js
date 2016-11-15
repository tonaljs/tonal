/**
 * This module contains functions to query tonal dictionaries.
 *
 * A tonal dictionary is basically a map from keys to list of intervals. It
 * also supports name aliases. See `tonal-chords` or `tonal-scales` to examples
 * of dictionaries.
 *
 * This functions are quite low level, and probably you wont need it, because
 * they are friendly served via `tonal-chords` and `tonal-scales`.
 *
 * __Those functions are NOT visible via `tonal` package__.
 *
 * @module dictionary
 */
function id (x) { return x }

/**
 * Query a tonal dictionary by key.
 *
 * If you pass two parameters you get a currified version: a dictionary getter.
 * (see example)
 *
 * @param {Function} parser - (Optional) the function to parse the intervals
 * @param {Hash<String, Array>} dictionary - the dictionary data
 * @param {String} key - the key to query
 * @return {Array} the list of intervals of that name or null if not present
 * in the dictionary
 * @example
 * var dict = require('tonal-dictionary')
 * var DATA = {
 * 'maj7': ['1 3 5 7', ['Maj7']],
 *   'm7': ['1 b3 5 7']
 * }
 * var chord = dict.get(null, DATA)
 * chord('maj7') // => [ '1', '3', '5', '7' ]
 * chord('Maj7') // => [ '1', '3', '5', '7' ]
 * chord('m7') // => ['1', 'b3', '5', '7']
 * chord('m7b5') // => null
 */
export function get (parse, raw, name) {
  if (arguments.length > 2) return get(parse, raw)(name)
  var data = Object.keys(raw).reduce(function (d, k) {
    // add intervals
    d[k] = raw[k][0].split(' ').map(parse || id)
    // add alias
    if (raw[k][1]) raw[k][1].forEach(function (a) { d[a] = d[k] })
    return d
  }, {})
  return function (n) {
    return data[n]
  }
}

/**
 * Query a tonal dictionary to get all the defined keys
 *
 * If you pass only one parameter you get a partially applied version: a
 * function that returns all keys of the given dictionary.
 *
 * @param {Hash<String, Array>} dictionary - the dictionary data
 * @param {Boolean} aliases - (Optional) true to include the name aliases
 * @return {Array<String>} a list of defined keys
 * @example
 * var dict = require('tonal-dictionary')
 * var DATA = {
 * 'maj7': ['1 3 5 7', ['Maj7']],
 *   'm7': ['1 b3 5 7']
 * }
 * dict.keys(DATA, false) // => ['maj7', 'm7']
 * dict.keys(DATA, true) // => ['maj7', 'm7', 'Maj7']
 * // partially applied
 * var chordNames = dict.keys(DATA)
 * chordNames() // => ['maj7', 'm7']
 */
export function keys (raw, alias) {
  if (arguments.length > 1) return keys(raw)(alias)
  var main = Object.keys(raw)
  var aliases = main.reduce(function (a, k) {
    if (raw[k][1]) raw[k][1].forEach(function (n) { a.push(n) })
    return a
  }, [])
  return function (alias) {
    return alias ? main.concat(aliases) : main.slice()
  }
}
