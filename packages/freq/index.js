/**
 * A collection of modules to work with note frequencies
 *
 * @example
 * var freq = require('tonal-freq')
 * freq.toFreq('A4') // => 440
 * freq.note(440) // => 'A4'
 * freq.noteAndDetune(320) // => ['C4', 200]
 * @module freq
 */
import { toMidi as noteToMidi, note as midiToNote } from 'tonal-midi'

// decorate a function to round the numeric result to a max
function round (m, fn) {
  m = m || m === 0 ? Math.pow(10, m) : false
  return function (v) {
    v = fn(v)
    return v === null ? null : m ? Math.round(v * m) / m : v
  }
}

/**
 * Return the equal tempered frequency of a note.
 *
 * This function can be partially applied if note parameter is not present.
 * @function
 * @param {Float} ref - the tuning reference
 * @param {Integer} maxDecimals - (Optional) the maximum number of decimals (all by default)
 * @param {String|Pitch} note - the note to get the frequency from
 * @return {Number} the frequency
 * @example
 * eqTempFreq(444, 4, 'C3')
 * const toFreq = eqTempFreq(444, 2)
 * toFreq('A3') // => 222
 */
export function eqTempFreq (ref, max, note) {
  if (arguments.length > 2) return eqTempFreq(ref, max)(note)
  return round(max, function (p) {
    var m = noteToMidi(p)
    return m ? Math.pow(2, (m - 69) / 12) * ref : null
  })
}

/**
 * Get the frequency of note with 2 decimals precission using A4 440Hz tuning
 *
 * This is an alias for: `eqTempFreq(440, 2, <note>)`
 *
 * @function
 * @param {Number|String} note - the note name or midi number
 * @return {Float} the frequency in herzs
 * @example
 * freq.toFreq('A4') // => 440
 * freq.toFreq('C4') // => 261.63
 */
export var toFreq = eqTempFreq(440, 2)

/**
 * Get the midi note from a frequency in equal temperament scale. You can
 * specify the number of decimals of the midi number.
 *
 * @param {Float} tuning - (Optional) the reference A4 tuning (440Hz by default)
 * @param {Number} freq - the frequency
 * @return {Number} the midi number
 */
export function eqTempFreqToMidi (ref, max, freq) {
  if (arguments.length > 2) return eqTempFreqToMidi(ref, max)(freq)
  return round(max, function (freq) {
    return 12 * (Math.log(freq) - Math.log(ref)) / Math.log(2) + 69
  })
}

/**
 * Get midi number from frequency with two decimals of precission.
 *
 * This is an alisas for: `eqTempFreqToMidi(440, 2, <freq>)`
 *
 * @function
 * @param {Float} freq
 * @return {Number} midi number
 * @example
 * freq.toMidi(361) // => 59.96
 */
export var toMidi = eqTempFreqToMidi(440, 2)

/**
 * Get note name from frequency using an equal temperament scale with 440Hz
 * as reference
 *
 * @param {Float} freq
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} note name
 * @example
 * freq.note(440) // => 'A4'
 */
export function note (freq, useSharps) {
  return midiToNote(toMidi(freq), useSharps)
}

/**
 * Get difference in cents between two frequencies. The frequencies can be
 * expressed with hertzs or midi numbers or note names
 * @param {Float|Integer|String} base
 * @param {Float|Integer|String} freq
 * @return {Integer} The difference in cents
 * @example
 * import { cents } from 'tonal-freq'
 * cents('C4', 261) // => -4
 */
export function cents (base, freq) {
  var b = toFreq(base) || base
  var f = toFreq(freq) || freq
  return Math.round(1200 * (Math.log(f / b) / Math.log(2)))
}
