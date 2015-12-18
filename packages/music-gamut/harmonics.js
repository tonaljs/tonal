
var operation = require('./operation')
var distance = require('note-interval')

/**
 * Get the distances from the first note of a gamut to the rest of notes
 *
 * Pitch classes are treated as notes with octave equal 0
 *
 * @name gamut.harmonics
 * @function
 * @param {String|Array} gamut - the list of notes
 *
 * @example
 * gamut.harmonics('c2 e2 g2') // => ['1P', '3M', '5P']
 */
module.exports = operation(function (gamut) {
  var tonic = gamut[0]
  return gamut.map(distance(tonic))
})
