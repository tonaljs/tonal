'use strict'

var parse = require('array-notation/note/parse')
var str = require('array-notation/note/str')
var KEYS = { major: 1, minor: 6, ionian: 1, dorian: 2, phrygian: 3, lydian: 4,
  mixolydian: 5, aeolian: 6, locrian: 7 }

/**
 * Build a key from key name
 *
 * @name key.build
 * @function
 * @param {String} name - the key name
 * @return {Array} an array with the tonic and mode or null if not valid key
 *
 * @example
 * var key = require('music.key')
 * key('C major') // => ['C', 'major']
 * key('fx MINOR') // => ['F##', 'minor']
 * key('Ab mixolydian') // => ['Ab', 'mixolydian']
 * key('f bebop') // => 'null'
 */
module.exports = function (name) {
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

function k (t, m) { return {tonic: t || false, mode: m, dist: KEYS[m]} }
