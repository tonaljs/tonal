'use strict'

var pitchSet = require('../set/pitchSet')
var distance = require('../pitch/distance')
var invert = require('../interval/invert')
var data = require('./scales-all.json')

/**
 * Given a pitch set return the scale name (if any)
 *
 * @example
 * names('C D E F G A B')
 */
function names (set) {
  set = pitchSet(set)
  var tonic = set[0]
  var intervals = set.map(function (pitch) { return distance(tonic, pitch) })
    .map(function (interval) {
      return /-/.test(interval) ? invert(interval, true) : interval
    })
  var names = findByValue(data, intervals.join(' '))
  return names.map(function (name) { return tonic + ' ' + name })
}

function findByValue (hash, value) {
  var found = []
  Object.keys(hash).forEach(function (key) {
    if (hash[key] === value) found.push(key)
  })
  return found
}

module.exports = names
