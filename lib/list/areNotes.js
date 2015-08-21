var toList = require('./list')
var isNote = require('../note/isNote')
/**
 * Given a list, check it its a note list
 *
 */
function areIntervals (list) {
  list = toList(list)
  if (!list || list.length === 0) return false
  for (var i = 0, len = list.length; i < len; i++) {
    if (!isNote(list[i])) return false
  }
  return true
}

module.exports = areIntervals
