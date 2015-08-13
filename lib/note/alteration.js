var alter = require('../misc/alteration')
var accidentals = require('./accidentals')

/**
 * @example
 * alteration('C#6') // 1
 * alteration('Db') // -1
 * alteration('E') // 0
 * alteration('bb') // => -1 (first char is the step)
 */
function alteration (note) {
  return alter(accidentals(note))
}
module.exports = alteration
