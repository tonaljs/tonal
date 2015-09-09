var toList = require('./list')
var isInterval = require('../interval/isInterval')
/**
 * Given a list, check it its a interval list
 *
 */
function areIntervals (list) {
  list = toList(list)
  if (!list || list.length === 0) return false
  for (var i = 0, len = list.length; i < len; i++) {
    if (!isInterval(list[i])) return false
  }
  return true
}

module.exports = areIntervals
