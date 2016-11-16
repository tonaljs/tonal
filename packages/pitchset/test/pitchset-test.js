var test = require('tape')
var pitchset = require('..')

test('pitchset: toBinary', function (t) {
  t.equal(pitchset.toBinary('c d e'), '101010000000')
  t.equal(pitchset.toBinary('g g#4 a bb5'), '000000011110')
  t.end()
})

test('pitchset: subset', function (t) {
  t.equal(pitchset.subset('c4 d5 e6', 'c2 d3'), true)
  t.equal(pitchset.subset('c4 d5 e6', 'c2 d3 e5'), true)
  t.equal(pitchset.subset('c d e', 'c d e f'), false)
  t.equal(pitchset.subset('c d e', 'c2 d3 f6'), false)
  t.end()
})

test('pitchset: superset', function (t) {
  t.equal(pitchset.superset('c d e', 'c2 d3 e4 f5'), true)
  t.equal(pitchset.superset('c d e', 'e f g'), false)
  t.equal(pitchset.superset('c d e', 'd e'), false)
  t.end()
})

test('pitchset: equal', function (t) {
  t.ok(pitchset.equal('c2 d3 e7 f5', 'c4 c d5 e6 f1'))
  t.end()
})
