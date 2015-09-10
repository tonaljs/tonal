'use strict'

var pitch = require('../pitch/pitch')

/**
 * A sequece is an ordered collection of pitches
 *
 * @param {Array|String} notes - the notes of the sequence
 * @return {Array} an array of notes
 *
 * @example
 * sequence('A B C') // => ['A4', 'B4', 'C4']
 */
function set (notes) {
  if (typeof notes === 'string') notes = notes.split(' ')
  if (!Array.isArray(notes)) return null

  return notes
    .map(function (name) { return pitch(name).name })
}

module.exports = set
