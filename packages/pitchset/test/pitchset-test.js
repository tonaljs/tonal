var test = require('tape')
var pitchset = require('..')

test('pitchset: notes', function (t) {
  t.deepEqual(pitchset.notes('C4 c3 C5 C4 c4'), ['C3', 'C4', 'C5'])
  t.end()
})
