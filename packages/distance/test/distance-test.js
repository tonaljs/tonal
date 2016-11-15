var test = require('tape')
var dist = require('..')

var map = function (fn, s) {
  if (arguments.length === 1) return function (s) { return map(fn, s) }
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

test('get distance between notes', function (t) {
  var fromC3 = map(dist.interval('C3'))
  t.deepEqual(fromC3('C3 e3 e4 c2 e2'),
    [ '1P', '3M', '10M', '-8P', '-6m' ])
  t.end()
})

test('distances between pitch classes are always ascending', function (t) {
  t.deepEqual(dist.interval('C', 'D'), '2M')
  var fromC = map(dist.interval('C'))
  t.deepEqual(fromC('c d e f g a b'),
    [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  var fromG = map(dist.interval('G'))
  t.deepEqual(fromG('c d e f g a b'),
    [ '4P', '5P', '6M', '7m', '1P', '2M', '3M' ])
  t.end()
})
test('get difference between intervals', function (t) {
  var subsM2 = map(dist.interval('M2'))
  t.deepEqual(subsM2('P1 M2 M3 P4 P5 M6 M7'),
    [ '-2M', '1P', '2M', '3m', '4P', '5P', '6M' ])
  t.end()
})
test('pitch types can not be mixed', function (t) {
  t.equal(dist.interval('C', 'C2'), null)
  t.equal(dist.interval('C2', 'C'), null)
  t.end()
})
test('when both pitches are in arra format, return array format', function (t) {
  t.deepEqual(dist.interval(['tnlp', [0, 0]], ['tnlp', [1, 0]]),
    [ 'tnlp', [1, 0], 1 ])
  t.end()
})
test('when one pitch in array format, return string', function (t) {
  t.deepEqual(dist.interval(['tnlp', [0]], 'D'), '2M')
  t.end()
})

test('semitones', function (t) {
  t.equal(dist.semitones('C3', 'G#3'), 8)
  t.equal(dist.semitones('C4', 'A3'), -3)
  t.equal(dist.semitones('blah', 'C3'), null)
  t.equal(dist.semitones('C', 'D'), 2)
  t.end()
})
