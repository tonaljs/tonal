var props = require('./props')
/**
 * Get the opposite of an interval
 *
 * An opposite interval is the same interval with the opposite direction
 *
 * @example
 * opposite('M2') // => 'M-2'
 * opposite('P-8') // => 'P8'
 */
function opposite (interval) {
  var i = props(interval)
  if (!i) return null
  return -1 * i.dir * i.num + i.quality
}

module.exports = opposite
