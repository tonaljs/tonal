'use strict'

var parse = require('music-notation/interval/parse')
var R = require('music-notation/note/regex')
var transpose = require('note-transpose')

/**
 * Create a musical dictionary. A musical dictionary is a function that given
 * a name (and optionally a tonic) returns an array of notes.
 *
 * A dictionary is created from a HashMap. It maps a name to a string with
 * an interval list and, optionally, an alternative name list (see example)
 *
 * Additionally, the dictionary has properties (see examples):
 *
 * - data: a hash with the dictionary data
 * - names: an array with all the names
 * - aliases: an array with all the names including aliases
 * - source: the source of the dictionary
 *
 * Each value of the data hash have the following properties:
 *
 * - name: the name
 * - aliases: an array with the alternative names
 * - intervals: an array with the intervals
 * - steps: an array with the intervals in __array notation__
 * - binary: a binary representation of the set
 * - decimal: the decimal representation of the set
 *
 * @name dictionary
 * @function
 * @param {Hash} source - the dictionary source
 * @return {Function} the dictionary
 *
 * @example
 * var dictionary = require('music-dictionary')
 * var chords = dictionary({'Maj7': ['1 3 5 7', ['M7']], 'm7': ['1 3b 5 7b'] })
 * chords('CMaj7') // => ['C', 'E', 'G', 'B']
 * chords('DM7') // => ['D', 'F#', 'A', 'C#']
 * chords('Bm7') // => ['B', 'D', 'F#', 'A']
 *
 * @example
 * // dictionary data
 * chords.data['M7'] // => { name: 'Maj7', aliases: ['M7'],
 *                   //      intervals: ['1', '3', '5', '7'], steps: [ ...],
 *                   //      binary: '10010010001', decimal: 2193 }
 *
 * // get chord by binary numbers
 * chords.data['100010010001'] === chords.data['Maj7']
 * chords.data[2193] === chords.data['Maj7']
 *
 * @example
 * // available names
 * chords.names // => ['Maj7', 'm7']
 * chords.aliases // => ['Maj7', 'm7', 'M7']
 */
module.exports = function (src) {
  function dict (name, tonic) {
    var v = dict.props(name)
    if (!v) {
      var n = R.exec(name)
      v = n ? dict.props(n[5]) : null
      if (!v) return []
      tonic = tonic === false ? tonic : tonic || n[1] + n[2] + n[3]
    }
    if (tonic !== false && !tonic) return function (t) { return dict(name, t) }
    return v.intervals.map(transpose(tonic))
  }
  return build(src, dict)
}

function build (src, dict) {
  var data = {}
  var names = Object.keys(src)
  var aliases = names.slice()

  dict.props = function (name) { return data[name] }
  dict.names = function (a) { return (a ? aliases : names).slice() }

  names.forEach(function (k) {
    var d = src[k]
    var c = { name: k, aliases: d[1] || [] }
    c.intervals = d[0].split(' ')
    c.steps = c.intervals.map(parse)
    c.binary = binary([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], c.steps)
    c.decimal = parseInt(c.binary, 2)
    data[k] = data[c.binary] = data[c.decimal] = c
    c.aliases.forEach(function (a) { data[a] = c })
    if (c.aliases.length > 0) aliases = aliases.concat(c.aliases)
  })
  return dict
}

function binary (num, intervals) {
  intervals.forEach(function (i) { num[(i[0] * 7 + i[1] * 12) % 12] = '1' })
  return num.join('')
}
