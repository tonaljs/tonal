var isInterval = require('../interval/is-interval')

function isIntervalSet (cycle) {
  if (!Array.isArray(cycle)) return false
  for (var i = 0, total = cycle.length; i < total; i++) {
    if (!isInterval(cycle[i])) return false
  }
  return true
}

module.exports = isIntervalSet
