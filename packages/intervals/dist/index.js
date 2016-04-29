'use strict';

var tonalPitches = require('tonal-pitches');
var tonalCollections = require('tonal-collections');

const CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
/**
 * Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
 * number of a given interval.
 *
 * In musical set theory, an interval class is the shortest distance in
 * pitch class space between two unordered pitch classes
 *
 * As paramter you can pass an interval in shorthand notation, an interval in
 * array notation or the number of semitones of the interval
 *
 * @name intervalClass
 * @function
 * @param {String|Integer} interval - the interval or the number of semitones
 * @return {Integer} A value between 0 and 6
 *
 * @example
 * const ic = require('interval-class')
 * ic('P8') // => 0
 * ic('m6') // => 4
 * ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
 */
function ic (ivl) {
  const s = typeof ivl === 'string' ? tonalPitches.chroma(ivl) : Math.round(ivl)
  return s !== null ? CLASSES[Math.abs(s) % 12] : null
}

/**
 * Get the intervals analysis of a collection of notes
 *
 * Returns an array with the format `[p, m, n, s, d, t]` where:
 *
 * - p: the number of perfect fourths or fifths
 * - m: the number of major thirds or minor sixths
 * - n: the number of major sixths or minor thirds
 * - s: the number of major seconds or minor sevenths
 * - d: the number of major sevents or minor seconds
 * - t: the number of tritones
 *
 * This is, mostly, an academic puzzle to show the expresiveness of tonal.
 * Implements the ideas found in "The Analysis of Intervals" chapter from
 * [Harmonic Materials of Modern Music]():
 *
 * > The letters _pmn_, therefore, represent intervals commonly considered
 * consonant, whereas the letters _sdt_ represent the intervals commonly
 * considered dissonant. (...) A sonority represented, for example, by the
 * symbol `sd^2`, indicating a triad composed of one major second and two minor
 * seconds, would be recognized as a highly dissonant sound, while the symbol
 * `pmn` would indicate a consonant sound.
 *
 * @name interval.density
 * @function
 * @param {Array|String} notes - the notes to analyze
 * @return {Array} the _pmnsdt_ array
 */
const density = tonalCollections.listFn((list) => {
  var a, b, i
  const notes = list.filter(tonalPitches.isPitchNotIvl)
  const len = notes.length
  const result = [0, 0, 0, 0, 0, 0]
  for (a = 0; a < len; a++) {
    for (b = a; b < len; b++) {
      i = ic(tonalPitches.chroma(notes[b]) - tonalPitches.chroma(notes[a]))
      if (i === 6) result[5] = result[5] + 1
      else if (i > 0) result[5 - i] = result[5 - i] + 1
    }
  }
  return result
})

exports.ic = ic;
exports.density = density;