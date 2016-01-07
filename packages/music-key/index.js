'use strict'

var transpose = require('note-transpose')
var interval = require('note-interval')
var parse = require('music-notation/note/parse')
var parseI = require('music-notation/interval/parse')
var str = require('music-notation/note/str')

var REGEX = /^#{1,7}|b{1,7}$/
var KEYS = { major: 1, minor: 6, ionian: 1, dorian: 2, phrygian: 3, lydian: 4,
  mixolydian: 5, aeolian: 6, locrian: 7 }
var SCALES = [
  '1 2 3 4 5 6 7', '1 2 3b 4 5 6 7b', '1 2b 3b 4 5 6b 7b', '1 2 3 4# 5 6 7',
  '1 2 3 4 5 6 7b', '1 2 3b 4 5 6b 7b', '1 2b 3b 4 5b 6b 7b'
].map(function (g) { return g.split(' ') })

/**
 * Create a key from a string. A key is a string with a tonic and a mode
 *
 * @name key
 * @function
 *
 * @example
 * var key = require('music-key')
 * key('C major') // => 'C major'
 * key('c Major') // => 'C major'
 * key('C') // => 'C major'
 * key('dbb miXolydian') // => 'Dbb mixolydian'
 */
function Key (str) {
  if (/^-?\d$/.exec(str)) {
    return major(+str)
  } else if (REGEX.exec(str)) {
    var dir = str[0] === 'b' ? -1 : 1
    return major(str.length * dir)
  } else {
    var p = Key.parse(str)
    return p ? p.tonic + ' ' + p.mode : null
  }
}
function major (n) { return transpose('C', [n, 0]) + ' major' }

/**
 * Parse a key name
 *
 * @name key.parse
 * @function
 * @param {String} name - the key name
 * @return {Array} an array with the tonic and mode or null if not valid key
 *
 * @example
 * var key = require('music-key')
 * key.parse('C major') // => ['C', 'major']
 * key.parse('fx MINOR') // => ['F##', 'minor']
 * key.parse('Ab mixolydian') // => ['Ab', 'mixolydian']
 * key.parse('f bebop') // => 'null'
 */
Key.parse = function (name) {
  var m, s, t
  if (!name) return null
  s = name.trim().split(/\s+/)
  t = str(parse((s[0])))
  if (s.length === 1) {
    m = s[0].toLowerCase()
    if (KEYS[m]) return k(null, m)
    else if (t) return k(t, 'major')
    else return null
  }
  m = s[1].toLowerCase()
  if (t && KEYS[m]) return k(t, m)
  return null
}

function k (t, m) { return {tonic: t || false, mode: m, alt: KEYS[m]} }

/**
 * Get relative of a key
 *
 * This function is currified, so it can be partially applied (see examples)
 *
 * @name key.relative
 * @function
 * @param {String} relative - the name of the relative mode desired
 * @param {String} key - the key name
 * @return {String} the relative key name or null if the key or the relative name
 * are not valid
 *
 * @example
 * var key = require('music-key')
 * key.relative('minor', 'C major') // => 'A minor'
 * key.relative('major', 'A minor') // => 'C major'
 * key.relative('dorian', 'F major') // => 'G dorian'
 *
 * // partially application
 * var minorOf = key.relative('minor')
 * minorOf('Bb major') // => 'G minor'
 */
Key.relative = function (rel, key) {
  if (arguments.length === 1) return function (k) { return Key.relative(rel, k) }
  var k = Key.parse(key)
  var r = Key.parse(rel)
  if (!k || !k.tonic || !r) return null
  var major = k.mode === 'major' ? k.tonic : transpose(k.tonic, '-' + k.alt)
  return r.mode === 'major' ? major + ' major' : transpose(major, '' + r.alt) + ' ' + rel
}

/**
 * Get the number of alterations of a key
 *
 * @name key.alteratons
 * @function
 * @param {String} name - the key name
 * @return {Integer} the number of alterations or null if not valid key
 *
 * @example
 * var key = require('music-key')
 * key.alterations('C major') // => 0
 * key.alterations('F major') // => -1
 * key.alterations('Eb major') // => -3
 * key.alterations('A major') // => 3
 * key.alterations('nonsense') // => null
 */
Key.alterations = function (key) {
  var k = Key.relative('major', key)
  return k ? parseI(interval('C', k.split(' ')[0]))[0] : null
}

/**
 * Get signature of a key
 *
 * @name key.signature
 * @function
 * @param {String} name - the key name
 * @return {String} a string with the alterations
 *
 * @example
 * var key = require('music-key')
 * key.signature('F major') // => 'b'
 * key.signature('Eb major') // => 'bbb'
 * key.signature('A major') // => '###'
 * key.signature('C major') // => ''
 * key.signature('nonsense') // => null
 */
Key.signature = function (key) {
  var n = Key.alterations(key)
  return n !== null ? new Array(Math.abs(n) + 1).join(n < 0 ? 'b' : '#') : null
}

/**
 * Get a list of altered notes in the appropriate order
 *
 * @name key.altered
 * @function
 * @param {String} name - the key name
 * @return {Array} an array with the altered notes ordered or an empty array
 * if its not a valid key name
 *
 * @example
 * key.altered('F major') // => ['Bb']
 * key.altered('Eb major') // => ['Bb', 'Eb', 'Ab']
 * key.altered('A major') // => ['F#', 'C#', 'G#']
 */
Key.altered = function (k) {
  var a = Key.alterations(k)
  if (a === null) return null
  var notes = []
  var tonic = a > 0 ? 'B' : 'F'
  var interval = a > 0 ? [1, 0] : [-1, 0]
  var l = Math.abs(a)
  for (var i = 0; i < l; i++) {
    tonic = transpose(tonic, interval)
    notes.push(tonic)
  }
  return notes
}

/**
 * Get the scale of a key
 *
 * @name key.scale
 * @function
 *
 * @example
 * var key = require('music-key')
 * key.scale('C major') // => ['C', 'D', 'E', ...]
 */
Key.scale = function (name) {
  var k = Key.parse(name)
  if (!k) return []
  return SCALES[k.alt - 1].map(transpose(k.tonic))
}

module.exports = Key
