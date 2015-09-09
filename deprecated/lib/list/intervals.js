var distance = require('../pitch/distance')
var toList = require('./list')

function intervals (list) {
  list = toList(list)
  if (!list) return null
  if (list[0] === 'P1' || list[0] === 'P-1') return list
  return list.map(distance.from(list[0]))
}

module.exports = intervals
