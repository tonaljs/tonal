/**
 * Get the pitch frequency in herzs (with custom concert tuning) from a midi number
 *
 * This function is currified so it can be partially applied (see examples)
 *
 * @name freq
 * @function
 * @param {Float} tuning - the frequency of A4 (null means 440)
 * @param {Integer} midi - the midi number
 * @return {Float} the frequency of the note
 *
 * @example
 * // 69 midi is A4
 * midi-to-freq(null, 69) // => 440
 * midi-to-freq(444, 69) // => 444
 *
 * @example
 * // partially applied
 * var freq = require('midi-to-freq')(440)
 * freq(69) // => 440
 */
module.exports = function freq (tuning, midi) {
  tuning = tuning || 440
  if (arguments.length > 1) return freq(tuning)(midi)

  return function (m) {
    return m > 0 && m < 128 ? Math.pow(2, (m - 69) / 12) * tuning : null
  }
}
