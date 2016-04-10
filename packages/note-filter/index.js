'use strict'

var gamut = require('music-gamut')
var parse = require('music-notation/note/parse')
var note = require('midi-note')
// descending dimished second
function prevEnh (n) { return [n[0] + 12, n[1] - 7, n[2]] }
// ascending dimished second
function nextEnh (n) { return [n[0] - 12, n[1] + 7, n[2]] }

/**
 * Filter notes using a function or a collection of notes
 *
 * This function is currified and can be partially applied.
 *
 * @function filter
 * @param {Function|String|Array} filter - the function to filter notes or the
 * collection of notes allowed. The collection of notes can be pitch classes or
 * individual notes. The function will receive one parameter with a note in
 * [array notation]() and must return true or false
 * @param {Array} notes - the notes to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * var filter = require('note-filter')
 * // filter by pitch class
 * filter('C', 'c3 c#2 c2 c4 cb2') // => ['C3', 'C2', 'C4'])
 * // filter by note
 * filter('c3', 'c1 c2 c3 c4 c5 c6') // => ['C3']
 * // filter by collection
 * filter('C E G3', 'c2 db2 c3 eb2 gb2 g3 ab g4') // => [ 'C2', 'C3', 'G3' ])
 *
 * @example
 * // partially applied
 * var cMajorFilter = filter('C D E F G A B')
 * cMajorFilter('c3') // => 'C3'
 * cMajorFilter('c#3') // => null
 */
function filter (fn, notes) {
  if (arguments.length > 1) return filter(fn)(notes)
  fn = filterFn(fn)
  return gamut.filter(fn)
}

/**
 * Filter midi notes using a filter function or a note list
 *
 * The difference from normal filter is that it check note enhramonics (see example)
 *
 * @name filter.midi
 * @function
 * @memberof filter
 * @param {Function|Array|String} filter - the filter function or the collection
 * of valid notes
 * @param {Integer|Array|String} midi - the midi notes
 *
 * @example
 * var filter = require('note-filter')
 * filter.midi('C D F', '60 61 62 63 64 65 66 67 69') // => ['C4', 'D4', 'F4']
 * // enhramonics
 * filter.midi('C D E#', '60 61 62 63 64 65 66 67 69') // => ['C4', 'D4', 'E#4']
 */
filter.midi = function (fn, midi) {
  if (arguments.length === 1) return function (m) { return filter.midi(fn, m) }
  fn = filterFn(fn)
  var midiNotes = gamut.split(midi).map(note)
  return gamut.reduce(function (notes, n) {
    if (fn(n)) notes.push(n)
    else if (fn(prevEnh(n))) notes.push(prevEnh(n))
    else if (fn(nextEnh(n))) notes.push(nextEnh(n))
    return notes
  }, [], midiNotes)
}

function filterFn (fn) {
  switch (typeof fn) {
    case 'function': return fn
    case 'string': return notesFilter(fn)
    default: throw Error('Not valid filter')
  }
}

// create a function that filter the given note
function noteFilter (n) {
  return n.length === 1 ? function (o) { return n[0] === o[0] }
  : function (o) { return n[0] === o[0] && n[1] === o[1] }
}

function notesFilter (notes) {
  var fns = gamut.split(notes).map(parse).map(noteFilter)
  var len = fns.length
  return function (note) {
    for (var i = 0; i < len; i++) {
      if (fns[i](note)) return true
    }
    return false
  }
}

module.exports = filter
