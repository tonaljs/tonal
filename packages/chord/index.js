/**
 * A chord is a harmonic unit with at least three different tones sounding simultaneously.
 *
 * This module have functions to create and manipulate chords. It includes a
 * chord dictionary and a simple chord detection algorithm.
 *
 * @example
 * var chord = require('tonal-chord')
 * chord.detect('c b g e') // => 'CMaj7'
 * chord.get('CMaj7') // => ['C', 'E', 'G', 'B']
 *
 * @module chord
 */
import { dictionary, detector } from 'tonal-dictionary'
import { map, compact, permutations, rotate } from 'tonal-array'
import { pc, note } from 'tonal-note'
import { regex } from 'note-parser'
import { harmonize, intervallic } from 'tonal-harmonizer'
import DATA from './chords.json'

var dict = dictionary(DATA, function (str) { return str.split(' ') })

/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * var chord = require('tonal-chord')
 * chord.names() // => ['maj7', ...]
 */
export var names = dict.keys

/**
 * Get chord notes or intervals from chord type
 *
 * This function is currified
 *
 * @param {String} type - the chord type
 * @param {Strng|Pitch} tonic - the tonic or false to get the intervals
 * @return {Array<String>} the chord notes or intervals, or null if not valid type
 *
 * @example
 * chords.get('dom7', 'C') // => ['C', 'E', 'G', 'Bb']
 * maj7 = chords.get('Maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 */
export function get (type, tonic) {
  if (arguments.length === 1) return function (t) { return get(type, t) }
  var ivls = dict.get(type)
  return ivls ? harmonize(ivls, tonic) : null
}

/**
 * Get the chord notes of a chord. This function accepts either a chord name
 * (for example: 'Cmaj7') or a list of notes.
 *
 * It always returns an array, even if the chord is not found.
 *
 * @param {String|Array} chord - the chord to get the notes from
 * @return {Array<String>} a list of notes or empty list if not chord found
 *
 * @example
 * chord.notes('Cmaj7') // => ['C', 'E', 'G', 'B']
 */
export function notes (chord) {
  var p = parse(chord)
  var ivls = dict.get(p.type)
  return ivls ? harmonize(ivls, p.tonic) : compact(map(note, chord))
}

/**
 * Get chord intervals. It always returns an array
 *
 * @param {String} name - the chord name (optionally a tonic and type)
 * @return {Array<String>} a list of intervals or null if the type is not known
 */
export function intervals (name) {
  var p = parse(name)
  return dict.get(p.type) || []
}

/**
 * Check if a given name correspond to a chord in the dictionary
 * @param {String} name
 * @return {Boolean}
 * @example
 * chord.isKnownChord('CMaj7') // => true
 * chord.isKnownChord('Maj7') // => true
 * chord.isKnownChord('Ablah') // => false
 */
export function isKnownChord (name) {
  return intervals(name).length > 0
}

/**
 * Detect a chord. Given a list of notes, return the chord name(s) if any.
 * It only detects chords with exactly same notes.
 *
 * @function
 * @param {Array|String} notes - the list of notes
 * @return {Array<String>} an array with the possible chords
 * @example
 * chord.detect('b g f# d') // => [ 'GMaj7' ]
 * chord.detect('e c a g') // => [ 'CM6', 'Am7' ]
 */
export var detect = detector(dict, '')

/**
 * Get the position (inversion number) of a chord (0 is root position, 1 is first
 * inversion...). It assumes the chord is formed by superposed thirds.
 *
 * @param {Array|String} chord - the chord notes
 * @return {Integer} the inversion number (0 for root inversion, 1 for first
 * inversion...) or null if not a valid chord
 *
 * @example
 * chord.position('e g c') // => 1
 * chord.position('g3 e2 c5') // => 1 (e is the lowest note)
 */
export function position (chord) {
  var pcs = map(pc, chord)
  var sorted = sortTriads(pcs)
  return sorted ? sorted.indexOf(pcs[0]) : null
}

/**
 * Given a chord in any inverstion, set to the given inversion. It accepts
 * chord names
 *
 * @param {Integer} num - the inversion number (0 root position, 1 first
 * inversion, ...)
 * @param {String|Array} chord - the chord name or notes
 * @return {Array} the chord pitch classes in the desired inversion or
 * an empty array if no inversion found (not triadic)
 *
 * @example
 * chord.inversion(1, 'Cmaj7') // => [ 'E', 'G', 'B', 'C' ]
 * chord.inversion(0, 'e g c') // => [ 'C', 'E', 'G' ]
 */
export function inversion (num, chord) {
  if (arguments.length === 1) return function (c) { return inversion(num, c) }
  var sorted = sortTriads(chord)
  return sorted ? rotate(num, sorted) : []
}

function sortTriads (chord) {
  var all = permutations(notes(chord).map(pc))
  for (var i = 0; i < all.length; i++) {
    var ivls = intervallic(all[i])
    if (areTriads(ivls)) return all[i]
  }
  return null
}

function areTriads (list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][0] !== '3') return false
  }
  return true
}

/**
 * Try to parse a chord name. It returns an array with the chord type and
 * the tonic. If not tonic is found, all the name is considered the chord
 * name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @param {String} name - the chord name
 * @return {Array} an array with [type, tonic]
 * @example
 * chord.parse('Cmaj7') // => { tonic: 'C', type: 'maj7' }
 * chord.parse('C7') // => { tonic: 'C', type: '7' }
 * chord.parse('mMaj7') // => { tonic: false, type: 'mMaj7' }
 * chord.parse('Cnonsense') // => { tonic: 'C', type: 'nonsense' }
 */
export function parse (name) {
  var p = regex().exec(name)
  if (!p) return { type: name, tonic: false }

  // If chord name is empty, the octave is the chord name
  return !p[4] ? { type: p[3], tonic: p[1] + p[2] }
    // If the octave is 6 or 7 is asumed to be part of the chord name
    : (p[3] === '7' || p[3] === '6') ? { type: p[3] + p[4], tonic: p[1] + p[2] }
    : { type: p[4], tonic: p[1] + p[2] + p[3] }
}
