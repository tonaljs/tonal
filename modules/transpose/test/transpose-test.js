var tape = require('tape')
var tr = require('../')

function map (fn, s) {
  if (arguments.length === 1) return function (s) { return map(fn, s) }
  return (Array.isArray(s) ? s : s.split(' ')).map(fn)
}

tape('order of params is not relevant', function (test) {
  test.equal(tr('c#2', 'm3'), tr('m3', 'c#2'))
  test.end()
})
tape('notes by intervals', function (test) {
  test.deepEqual(map(tr('3M'), 'c2 d3 f4 g5'),
    [ 'E2', 'F#3', 'A4', 'B5' ])
  test.end()
})
tape('notes by descending intervals', function (test) {
  test.deepEqual(map(tr('-2M'), 'c2 d3 f4 g5'),
    [ 'Bb1', 'C3', 'Eb4', 'F5' ])
  test.end()
})
tape('intervals by intervals', function (test) {
  test.deepEqual(map(tr('3M'), '1P 2M 3M 4P 5P'),
    [ '3M', '4A', '5A', '6M', '7M' ])
  test.end()
})
tape('descending intervals', function (test) {
  test.deepEqual(map(tr('-2M'), '1P 2M 3M 4P 5P'),
    [ '-2M', '1P', '2M', '3m', '4P' ])
  test.end()
})
tape('all desending intervals', function (test) {
  test.deepEqual(map(tr('-2M'), '-5P -4P -3M -2M 1P'),
    ['-6M', '-5P', '-4A', '-3M', '-2M'])
  test.end()
})
tape('returns array notation if both params are in array notation', function (test) {
  test.deepEqual(tr(['tnl-ivl', [1, 0], 1], ['tnl-note', [1, 0]]),
    [ 'tnl-note', [2, 0] ])
  test.end()
})
