'use strict'

var R = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)(\/\d+|)\s*(.*)\s*$/

/**
 * Split a note string into its parts
 *
 * It returns an array with:
 *
 * - 0: the complete string
 * - 1: the note letter
 * - 2: the accidentals
 * - 3: the octave
 * - 4: the duration
 * - 5: the element name
 *
 * @name note.split
 * @param {String} source - the string to be parsed
 * @return {Array} the parsed parts or null if not valid note
 *
 * @example
 * var split = require('tonal-notation/note.split')
 * split('c#4') // => ['c#4', 'c', '#', '4', '', '']
 */
module.exports = function (s) { return R.exec(s) }
