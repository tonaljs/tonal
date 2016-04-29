'use strict';

var tonalPitches = require('tonal-pitches');

/**
 * Given a note (as string or as array notation) returns a string
 * with the note name in scientific notation or null
 * if not valid note
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 * @example
 * import { name } from 'tonal-notes'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(name)
 * // => ['C', 'Db3', null, null, 'G##4']
 */
const name = tonalPitches.noteFn(tonalPitches.id)

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 */
const pc = tonalPitches.noteFn((p) => [ 'tnl', p[1] ])

exports.name = name;
exports.pc = pc;