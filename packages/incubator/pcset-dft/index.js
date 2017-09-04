/**
 * `tonal-pcset-dft` is a implementation of the Discrete Fourier Transform
 * applied to pitch class sets.
 *
 * The DFT provides a kind of harmonic blueprint by which we may characterize a
 * pitch set (a chord, for example) and compare it to others in a way that
 * correspond to our perception of sounding similar.
 *
 * David Lewin was the first to note the connection between the Fourier
 * transform and a chord’s harmonic content. Other theorists have incorporated
 * this mathematical technique into their work, including Vuza (1993),
 * Quinn (2006 and 2007), and Amiot (2007)
 *
 * References:
 * - [1] [Set-Class Similarity, Voice Leading, and the Fourier Transform (Dmitri Tymoczko)](http://dmitri.mycpanel.princeton.edu/files/publications/fourier.pdf)
 * - [2] [Continuous Harmonic Spaces (Clifton Callender)]()
 *
 * __This module is not YET included in the tonal facade__
 *
 * @example
 * var dft = require('tonal-pcset-dft')
 * dft.spectra('C E G#') // => [3, 0, 0, 3, 0, 0, 3]
 *
 * @module pcset-dft
 */

import { chroma } from "tonal-note";
import { map } from "tonal-array";
var { PI, sin, cos, pow, sqrt } = Math;

export function pcset(notes) {
  return Object.keys(
    map(chroma, notes).reduce(function(set, ch) {
      set[ch] = true;
      return set;
    }, {})
  );
}

/**
 * Get the Fourier components of a pitch class set
 *
 * It applies the Discrete Fourier Transform to the pitch class set with
 * numbers from 0 to 6 (the _Niquist_ frequency: N / 2 where N is the number of
 * possible pitch classes)
 * @param {String|Array} notes - the notes or pitch class set
 * @return {Array} the fourier components
 * @example
 * dft.dft('C E G#') // => [ [3, 0], [0, 0], [0, 0], [3, 0], [0, 0], [0, 0], [3, 0] ])
 */
export function dft(notes) {
  var pcs = pcset(notes);
  return [0, 1, 2, 3, 4, 5, 6].map(function(n) {
    return truncate(component(n, pcs));
  });
}

/**
 * Get the nth component of a given pitch class set
 * @private
 */
function component(n, pcs) {
  return pcs.reduce(
    function(complex, p) {
      // calculate the complex number for n
      var v = 2 * PI * p * n / 12;
      complex[0] += cos(v);
      complex[1] += sin(v);
      return complex;
    },
    [0, 0]
  );
}

var MIN = 1e-10;
/**
 * Set 0 very small numbers in a complex number
 * @private
 */
function truncate(cpx) {
  if (cpx[0] < MIN) cpx[0] = 0;
  if (cpx[1] < MIN) cpx[1] = 0;
  return cpx;
}

/**
 * The spectra of pitch-class sets in twelve-tone equal temperament
 * is the magnitudes of the first six harmonics (in addition to harmonic zero)
 *
 * @param {String|Array} notes - the notes or pitch set
 * @return {Array<Number>} the magnitudes of the dft
 * @example
 * dft.spectra('C E G#') // => [3, 0, 0, 3, 0, 0, 3]
 */
export function spectra(notes) {
  var comp = dft(notes);
  return comp.map(function(complex) {
    return sqrt(pow(complex[0], 2) + pow(complex[1], 2));
  });
}

/**
 * A natural way to measure the distance between two spectra is to take
 * the Euclidean distance between their corresponding spectra
 * @param {String|Array} set1 - the first pitch class set or notes
 * @param {String|Array} set2 - the second pitch class set or notes
 * @return the Euclidean distance between both
 */
export function distance(set1, set2) {
  var sp1 = spectra(set1);
  var sp2 = spectra(set2);
  return Math.sqrt(
    sp1.reduce(function(v, _, i) {
      return v + Math.pow(sp1[i] - sp2[i], 2);
    }, 0)
  );
}
