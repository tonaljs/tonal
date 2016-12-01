var tonal = require('../packages/tonal')
var dft = require('../packages/pcset-dft')

console.log('Sort chords by dft distance to C major')

var base = ['C', 'E', 'G']
console.log('Base chord', base)

// Get all chord names
var chords = tonal.chord.names().map(function (name) {
  // Get the notes
  var notes = tonal.chord.get(name, 'C')
  // And calculate the distance from base
  var distance = dft.distance(base, notes)
  return { name, notes, distance }
})

var sorted = chords.sort(function (a, b) {
  return a.distance - b.distance
})
console.log('Sorted:', sorted.map(c => c.name).join(' | '))
