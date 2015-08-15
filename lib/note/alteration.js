var alter = require('../misc/alteration')
var parse = require('./parse')

/**
 * Return the alteration number of the note
 *
 * @param {String} note - the note
 * @return {Integer} the alteration number
 *
 * @see misc/alteration
 * @module note
 *
 * @example
 * alteration('C#6') // 1
 * alteration('Db') // -1
 * alteration('E') // 0
 * alteration('bb') // => -1 (first char is the step)
 */
function alteration (note) {
  return alter(parse(note).acc)
}
module.exports = alteration
