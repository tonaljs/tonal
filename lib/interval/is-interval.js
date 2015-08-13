var INTERVAL = /^[AdmMP]-?\d+$/

function isInterval (interval) {
  return INTERVAL.test(interval)
}

module.exports = isInterval
