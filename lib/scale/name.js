'use strict'

var pitchSet = require('../set/pitchSet')
var distance = require('../pitch/distance')
var data = require('./scales-all.json')
var revIndex = null

/**
 * Given a pitch set return the scale name (if any)
 *
 * @example
 * name('C D E F G A B')
 */
function name (set) {
  set = pitchSet(set)
  var tonic = set[0]
  var intervals = set.map(function (pitch) { return distance(tonic, pitch) })
  var name = findName(intervals.join(' '))
  return name ? tonic + ' ' + name : null
}

function findName (key) {
  if (!revIndex) {
    revIndex = {}
    Object.keys(data).forEach(function (name) {
      revIndex[data[name]] = name
    })
  }
  return revIndex[key]
}

module.exports = name
