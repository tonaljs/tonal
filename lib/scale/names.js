'use strict'

var pitchSet = require('../sequence/pitchSet')
var distance = require('../pitch/distance')
var invert = require('../interval/invert')
var data = require('./scales-all.json')
var keys = null

/**
 * Given a pitch set return the scale name (if any)
 *
 * @example
 * names('C D E F G A B')
 */
function names (set) {
  keys = keys || Object.keys(data)
  if (!set) return keys

  set = pitchSet(set)
  var tonic = set[0]
  var intervals = set.map(function (pitch) { return distance(tonic, pitch) })
    .map(function (interval) {
      return /-/.test(interval) ? invert(interval, true) : interval
    })
  var names = findByValue(keys, data, intervals.join(' '))
  return names.map(function (name) { return tonic + ' ' + name })
}

function findByValue (keys, hash, value) {
  var found = []
  keys.forEach(function (key) {
    if (hash[key] === value) found.push(key)
  })
  return found
}

module.exports = names
