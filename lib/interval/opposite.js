var parse = require('./parse')
/**
 * Given an interval, return its opposite
 *
 * @example
 * opposite('M2') // => 'M-2'
 * opposite('P-8') // => 'P8'
 */
function opposite (interval) {
  var i = parse(interval)
  if (!i) return null
  return i.quality + -1 * i.dir * i.num
}

module.exports = opposite
