var tape = require('tape')
var t = require('../')

function map (fn, s) {
  if (arguments.length === 1) return function (s) { return map(fn, s) }
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

tape('order of params is not relevant', function (test) {
  test.equal(t.tr('c#2', 'm3'), t.tr('m3', 'c#2'))
  test.end()
})
tape('notes by intervals', function (test) {
  test.deepEqual(map(t.tr('3M'), 'c2 d3 f4 g5'),
    [ 'E2', 'F#3', 'A4', 'B5' ])
  test.end()
})
tape('pitch classes by intervals', function (test) {
  test.deepEqual(map(t.tr('Bb'), 'P1 M3 P5 M7'),
    [ 'Bb', 'D', 'F', 'A' ])
  test.end()
})
tape('transpose nulls', function (test) {
  test.equal(t.tr('M3', 'blah'), null)
  test.equal(t.tr('C2', 'blah'), null)
  test.equal(t.tr(null, null), null)
  test.end()
})
tape('notes by descending intervals', function (test) {
  test.deepEqual(map(t.tr('-2M'), 'c2 d3 f4 g5'),
    [ 'Bb1', 'C3', 'Eb4', 'F5' ])
  test.end()
})
tape('intervals by intervals', function (test) {
  test.deepEqual(map(t.tr('3M'), '1P 2M 3M 4P 5P'),
    [ '3M', '4A', '5A', '6M', '7M' ])
  test.end()
})
tape('descending intervals', function (test) {
  test.deepEqual(map(t.tr('-2M'), '1P 2M 3M 4P 5P'),
    [ '-2M', '1P', '2M', '3m', '4P' ])
  test.end()
})
tape('all desending intervals', function (test) {
  test.deepEqual(map(t.tr('-2M'), '-5P -4P -3M -2M 1P'),
    ['-6M', '-5P', '-4A', '-3M', '-2M'])
  test.end()
})
tape('returns array notation if both params are in array notation', function (test) {
  test.deepEqual(t.tr(['tnlp', [1, 0], 1], ['tnlp', [1, 0]]),
    [ 'tnlp', [2, 0] ])
  test.end()
})
tape('transpose edge cases', function (test) {
  var trC = function (i) { return i.split(' ').map(t.tr('C2')) }
  test.deepEqual(trC('1d 1P 1A'), ['Cb2', 'C2', 'C#2'])
  test.deepEqual(trC('-1d -1P -1A'), ['C#2', 'C2', 'Cb2'])
  test.deepEqual(trC('2d 2m 2M 2A'), [ 'Dbb2', 'Db2', 'D2', 'D#2' ])
  test.deepEqual(trC('-2d -2m -2M -2A'), [ 'B#1', 'B1', 'Bb1', 'Bbb1' ])
  test.deepEqual(trC('4dd 4d 4P 4A 4AA'), [ 'Fbb2', 'Fb2', 'F2', 'F#2', 'F##2' ])
  test.deepEqual(trC('5P -5P 5A -5A'), ['G2', 'F1', 'G#2', 'Fb1'])
  test.deepEqual(trC('6M -6M 6m -6m'), ['A2', 'Eb1', 'Ab2', 'E1'])
  test.end()
})

tape('transpose fifths', function (test) {
  test.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map(t.trFifths('C')),
    [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#' ])
  test.end()
})
