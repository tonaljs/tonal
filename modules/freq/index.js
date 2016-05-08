import { toMidi, fromMidi } from 'tonal-midi'

/**
 * Return a function that converts midi or notes names to frequency using
 * equal temperament.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts midi numbers,
 * note names, pitches and returns a float.
 * @example
 * import { toEqualTemp } from 'tonal-freq'
 * const toFreq = toEqualTemp(444)
 * toFreq('A3') // => 222
 */
export function toEqualTemp (ref) {
  return function (p) {
    var m = toMidi(p)
    return m ? Math.pow(2, (m - 69) / 12) * ref : null
  }
}

/**
 * Get the frequency of a pitch using equal temperament scale and A4 equal to 440Hz
 * @function
 * @param {Number|String} note - the note name or midi number
 * @return {Float} the frequency in herzs
 * @example
 * import { toFreq } from 'tonal-freq'
 * toFreq('A4') // => 440
 * // using tonal
 * tonal.toFreq('C4') // => 261.6255653005986
 */
export var toFreq = toEqualTemp(440)

/**
 * Create a function that returns a midi number from a frequency using an
 * equal temperament and `ref` frequency as 'A4' frequency.
 *
 * @param {Float} ref - the frequency of A4
 * @return {Function} a function that converts from frequency to midi
 */
export function fromEqualTemp (ref) {
  return function (freq) {
    var midi = 12 * (Math.log(freq) - Math.log(ref)) / Math.log(2) + 69
    return Math.round(midi)
  }
}

/**
 * Get note from frequency using a equal temeperament scale and 440Hz as
 * freq reference
 * @param {Float} freq
 * @return {Integer} midi number
 * @function
 */
export var midiFromFreq = fromEqualTemp(440)

/**
 * Get note name from frequency using an equal temperament scale with 440Hz
 * as reference
 * @param {Float} freq
 * @return {String} note name
 */
export function fromFreq (freq) {
  return fromMidi(midiFromFreq(freq))
}

/**
 * Get difference in cents between two frequencies. The frequencies can be
 * expressed with hertzs or midi numbers or note names
 * @param {Float|Integer|String} base
 * @param {Float|Integer|String} freq
 * @return {Float} The difference in cents
 * @example
 * import { cents } from 'tonal-freq'
 * cents('C4', 261) // => -4.1444603457298985
 */
export function cents (base, freq) {
  var b = toFreq(base) || base
  var f = toFreq(freq) || freq
  return 1200 * (Math.log(f / b) / Math.log(2))
}
