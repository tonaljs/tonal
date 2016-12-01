/**
 * `tonal-pcset-dft` is a implementation of the Discrete Fourier Transform
 * applied to pitch class sets.
 *
 * References:
 * - Set-Class Similarity, Voice Leading, and the Fourier Transform (Dmitri Tymoczko): http://dmitri.mycpanel.princeton.edu/files/publications/fourier.pdf
 * - Continuous Harmonic Spaces (Clifton Callender)
 *
 * __This module is not YET included in the tonal facade__
 *
 * @example
 * var dft = require('tonal-pcset-dft')
 * dft.spectra('C E G#') // => [3, 0, 0, 3, 0, 0, 3]
 *
 * @module pcset-dft
 */

import { chroma } from 'tonal-note'
import { map } from 'tonal-array'
const { PI, sin, cos, pow, sqrt } = Math

export function pcset (notes) {
  return Object.keys(map(chroma, notes).reduce(function (set, ch) {
    set[ch] = true
    return set
  }, {}))
}

var MIN = 1e-10
/**
 * Get the Fourier components of a pitch class set
 *
 * It applies the Discrete Fourier Transform to the pitch class set with
 * numbers from 0 to 6 (the _Niquist_ frequency: N / 2 where N is the number of
 * possible pitch classes)
 */
export function dft (notes) {
  var pcs = pcset(notes)
  return [0, 1, 2, 3, 4, 5, 6].map(function (n) {
    return pcs.reduce(function (complex, p) {
      // calculate the complex number for n
      var v = 2 * PI * p * n / 12
      complex[0] += cos(v)
      complex[1] += sin(v)
      return complex
    }, [0, 0])
  }).map(function (complex) {
    // set to 0 very small numbers
    if (complex[0] < MIN) complex[0] = 0
    if (complex[1] < MIN) complex[1] = 0
    return complex
  })
}

/**
 * The spectra is the magnitudes of the dft components.
 *
 * @param {String|Array} notes - the notes or pitch set
 * @return {Array<Number>} the magnitudes of the dft
 * @example
 * dft.spectra('C E G#') // => [3, 0, 0, 3, 0, 0, 3]
 */
export function spectra (notes) {
  var comp = dft(notes)
  return comp.map(function (complex) {
    return sqrt(pow(complex[0], 2) + pow(complex[1], 2))
  })
}

/**
 * A natural way to measure the distance between two spectra is to take
 * the Euclidean distance between their corresponding points.
 */
