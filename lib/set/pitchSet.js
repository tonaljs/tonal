'use strict'

var pitch = require('../pitch/pitch')
var list = require('../list/list')

/**
 * A pitch set is a collection of unique pitch classes ordered by frequency
 *
 * @param {Array|String} notes - a group of notes
 * @return {Array} a pitch set
 *
 * @example
 * pitchSet('D3 Db3 C3 D3') // => ['C3', 'Db3', 'D3']
 */
function pitchSet (notes) {
  notes = list(notes, pitch)
  var pcs = notes.map(by('pitchClass')).sort()
  var uniq = pcs.filter(function (p, i) { return i === 0 || pcs[i] !== pcs[i - 1] })
  var index = uniq.indexOf(notes[0].pitchClass)
  return uniq.slice(index).concat(uniq.slice(0, index))
}

function by (name) {
  return function (i) { return i ? i[name] : null }
}

module.exports = pitchSet
