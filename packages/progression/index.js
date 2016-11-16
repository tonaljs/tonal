/**
 * Work with chord progressions.
 *
 * @example
 * var progression = require('tonal-progression')
 * progression.abstract('Cmaj7 Dm7 G7', 'C')
 *
 * @module progression
 */
import { encode } from 'tonal-pitch'
import { pc } from 'tonal-note'
import { props } from 'tonal-interval'
import { map, compact } from 'tonal-array'
import { transpose } from 'tonal-transpose'
import { interval } from 'tonal-distance'
import { parse } from 'tonal-chord'
import { toAcc } from 'tonal-notation'

/**
 * Given a chord progression and a tonic, return the chord progression
 * with roman numeral chords.
 *
 * @param {Array|String} chords - the chord progression
 * @param {String} tonic - the tonic
 * @return {Array} the chord progression in roman numerals
 * @example
 * progression.abstract('Cmaj7 Dm7 G7', 'C') // => [ 'Imaj7', 'IIm7', 'V7' ]
 */
export function abstract (chords, tonic) {
  tonic = pc(tonic)
  chords = map(parse, chords)
  var tonics = compact(chords.map(function (x) { return x[1] }))
  // if some tonic missing, can't do the analysis
  if (tonics.length !== chords.length) return null

  return tonics.map(function (t, i) {
    var p = props(interval(tonic, t))
    return buildRoman(p.num - 1, p.alt, chords[i][0])
  })
}

var NUMS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
/**
 * Build an abstract chord name using roman numerals
 */
export function buildRoman (num, alt, element) {
  return toAcc(alt) + NUMS[num % 7] + (element || '')
}

/**
 * Get chord progression from a tonic and a list of chord in roman numerals
 *
 * @param {String} tonic - the tonic
 * @param {Array|String} progression - the progression in roman numerals
 * @return {Array} the chord progression
 *
 * @example
 * var progression = require('chord-progression')
 * progression.concrete('I IIm7 V7', 'C') // => ['C', 'Dm7', 'G7']
 */
export function concrete (chords, tonic) {
  return map(function (e) {
    var r = parseRomanChord(e)
    return r ? transpose(r.root, tonic) + r.name : null
  }, chords)
}

var ROMAN = /^\s*(b|bb|#|##|)(IV|III|II|I|VII|VI|V|iv|iii|ii|i|vii|vi|v)\s*(.*)\s*$/
/**
 * Returns a regex to match roman numbers literals with the from:
 * `[accidentals]roman[element]`.
 *
 * The executed regex contains:
 *
 * - input: the input string
 * - accidentals: (Optional) one or two flats (b) or shaprs (#)
 * - roman: (Required) a roman numeral from I to VII either in upper or lower case
 * - element: (Optional) a name of an element
 *
 * @return {RegExp} the regexp
 *
 * @example
 * var r = progression.romanRegex()
 * r.exec('bVImaj7') // => ['bVImaj7', 'b', 'VI', 'maj7'])
 * r.exec('III dom') // => ['III dom', '', 'III', 'dom'])
 */
export function romanRegex () { return ROMAN }

var NUM = {i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6}

/**
 * Parse a chord expressed with roman numerals. It returns an interval representing
 * the root of the chord relative to the key tonic and the chord name.
 *
 * @param {String} str - the roman numeral string
 * @return {Object} the roman number in array notation or null if not valid numeral
 *
 * @example
 * var parse = require('music-notation/roman.parse')
 * parse('V7') // => { root: ['tnl', 1, 0, 0, 1], name: '7'}
 * parse('bIIalt') // => [ root: ['tnl', -5, 0, 2, 1], name: 'alt']
 */
export function parseRomanChord (str) {
  var m = ROMAN.exec(str)
  if (!m) return null
  var num = NUM[m[2].toLowerCase()]
  var alt = m[1].length
  if (m[1][0] === 'b') alt = -alt
  return { root: encode(num, alt, 0, 1), name: m[3] }
}
