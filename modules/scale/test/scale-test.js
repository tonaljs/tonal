var test = require('tape')
var scale = require('..')

test('creates a scale from name', function (t) {
  t.deepEqual(scale.get('C major'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  t.deepEqual(scale.get('C2 major'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
  t.end()
})
test('create scale', function (t) {
  t.deepEqual(scale.build('major', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  t.deepEqual(scale.build('major', 'C2'), [ 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2' ])
  // alias
  t.deepEqual(scale.build('ionian', 'C'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  // intervals
  t.deepEqual(scale.build('major', false), [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  // partially applied
  t.deepEqual(scale.build('major')('Db'), [ 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C' ])
  // empty scale
  t.deepEqual(scale.build('no-scale', 'D'), [])
  t.end()
})
test('has names function', function (t) {
  t.ok(scale.names().length > 0)
  t.ok(scale.names(true).length > scale.names().length)
  t.end()
})
