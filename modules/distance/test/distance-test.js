var tape = require('tape')
var dist = require('..').distance

var map = function (fn, s) {
  if (arguments.length === 1) return function (s) { return map(fn, s) }
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

tape('get distance between notes', function (test) {
  var fromC3 = map(dist('C3'))
  test.deepEqual(fromC3('C3 e3 e4 c2 e2'),
    [ '1P', '3M', '10M', '-8P', '-6m' ])
  test.end()
})
tape('distances between pitch classes are always ascending', function (test) {
  test.deepEqual(dist('C', 'D'), '2M')
  var fromC = map(dist('C'))
  test.deepEqual(fromC('c d e f g a b'),
    [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  var fromG = map(dist('G'))
  test.deepEqual(fromG('c d e f g a b'),
    [ '4P', '5P', '6M', '7m', '1P', '2M', '3M' ])
  test.end()
})
tape('get difference between intervals', function (test) {
  var subsM2 = map(dist('M2'))
  test.deepEqual(subsM2('P1 M2 M3 P4 P5 M6 M7'),
    [ '-2M', '1P', '2M', '3m', '4P', '5P', '6M' ])
  test.end()
})
tape('pitch types can not be mixed', function (test) {
  test.equal(dist('C', 'C2'), null)
  test.equal(dist('C2', 'C'), null)
  test.end()
})
tape('when both pitches are in arra format, return array format', function (test) {
  test.deepEqual(dist(['tnlp', [0, 0]], ['tnlp', [1, 0]]),
    [ 'tnlp', [1, 0], 1 ])
  test.end()
})
tape('when one pitch in array format, return string', function (test) {
  test.deepEqual(dist(['tnlp', [0]], 'D'), '2M')
  test.end()
})
