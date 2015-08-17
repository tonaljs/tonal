var accidentals = require('./accidentals')

/**
 * TODO: write proper docs
 * @example
 * alteration('C#6') // 1
 * alteration('Db') // -1
 * alteration('E') // 0
 * alteration('#') // => 1
 * alteration('##') // => 2
 * alteration('b') // => -1
 * alteration('bb') // => -2
 * alteration('') // 0
 */
function alteration (value) {
  if (/^#+$/.test(value)) return value.length
  else if (/^b*$/.test(value)) return -1 * value.length
  else return alteration(accidentals(value))
}
module.exports = alteration
