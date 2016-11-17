var test = require('tape')
var _ = require('../')
function up (s) { return s.toUpperCase() }

test('array: asArr', function (t) {
  t.deepEqual(_.asArr('a b c'), [ 'a', 'b', 'c' ])
  t.deepEqual(_.asArr('a |  b    |  c   '), ['a', 'b', 'c'])
  t.deepEqual(_.asArr('a , b  | c    d'), ['a', 'b', 'c', 'd'])
  t.end()
})

test('array: map', function (t) {
  t.deepEqual(_.map(up, 'a bb cx'), [ 'A', 'BB', 'CX' ])
  var ups = _.map(up)
  t.deepEqual(ups('a bb cx'), [ 'A', 'BB', 'CX' ])
  t.end()
})

test('array: sort', function (t) {
  // sort notes
  t.deepEqual(_.sort('c4 c3 c2'), [ 'C2', 'C3', 'C4' ])
  t.deepEqual(_.sort('c2 c3 c4', false), [ 'C4', 'C3', 'C2' ])
  // sort pitch classes
  t.deepEqual(_.sort('a b c d e f g'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  // sort intervals
  t.deepEqual(_.sort('2m 1P 3m 3M 4A 4P 9m 8P'), [ '1P', '2m', '3m', '3M', '4P', '4A', '8P', '9m' ])
  t.deepEqual(_.sort('2m 1P 3m 3M 4A 4P 9m 8P', false), [ '9m', '8P', '4A', '4P', '3M', '3m', '2m', '1P' ])

  // pitch classes are sorted before notes
  t.deepEqual(_.sort('c3 d2 d c'), [ 'C', 'D', 'D2', 'C3' ])
  // anything is not a pitch is removed
  t.deepEqual(_.sort('a2 g3 f h c n x'), [ 'C', 'F', 'A2', 'G3' ])
  t.deepEqual(_.sort('a2 g3 f h c n x', false), [ 'G3', 'A2', 'F', 'C' ])
  t.end()
})

test('array: compact', function (t) {
  t.deepEqual(_.compact(['a', null, 'b']), ['a', 'b'])
  t.deepEqual(_.compact([0, 1, 2, 3, null, 4]), [ 0, 1, 2, 3, 4 ])
  t.end()
})

test('array: filter', function (t) {
  function isUpLetter (s) { return 'CDEFGAB'.indexOf(s[0]) !== -1 }
  t.deepEqual(_.filter(isUpLetter, 'C d f4 A4 M3'),
  [ 'C', 'A4' ])
  t.end()
})

test('array: shuffle', function (t) {
  var s = _.shuffle('A B C D')
  t.equal(s.length, 4)
  t.notEqual(s.indexOf('A'), -1)
  t.notEqual(s.indexOf('B'), -1)
  t.notEqual(s.indexOf('C'), -1)
  t.notEqual(s.indexOf('D'), -1)
  t.end()
})

test('array: rotate', function (t) {
  t.deepEqual(_.rotate(1, 'c d e'), ['d', 'e', 'c'])
  t.deepEqual(_.rotate(-1, 'c d e'), [ 'e', 'c', 'd' ])
  t.deepEqual(_.rotate(0, 'c d e'), [ 'c', 'd', 'e' ])
  t.end()
})

test('array: rotateAsc', function (t) {
  t.deepEqual(_.rotateAsc(1, 'c d e'), ['D', 'E', 'C'])
  t.deepEqual(_.rotateAsc(-1, 'c d e'), [ 'E', 'C', 'D' ])
  t.deepEqual(_.rotateAsc(0, 'c d e'), [ 'C', 'D', 'E' ])
  t.deepEqual(_.rotateAsc(1, 'c4 d4 e4'), [ 'D4', 'E4', 'C5' ])
  t.deepEqual(_.rotateAsc(2, 'c4 d4 e4'), [ 'E4', 'C5', 'D5' ])
  t.deepEqual(_.rotateAsc(-1, 'c4 d4 e4'), [ 'E3', 'C4', 'D4' ])
  t.deepEqual(_.rotateAsc(-2, 'c4 d4 e4'), [ 'D3', 'E3', 'C4' ])
  t.deepEqual(_.rotateAsc(1, 'C1 D3 E5'), [ 'D3', 'E5', 'C6' ])
  t.deepEqual(_.rotateAsc(2, 'C1 D3 E5'), [ 'E5', 'C6', 'D8' ])
  t.deepEqual(_.rotateAsc(-1, 'C1 D3 E5'), [ 'E0', 'C1', 'D3' ])
  t.deepEqual(_.rotateAsc(-2, 'C1 D3 E5'), [ 'D-2', 'E0', 'C1' ])
  t.end()
})

test('select', function (t) {
  t.deepEqual(_.select('1 3 5', 'C D E F G A B'), ['C', 'E', 'G'])
  t.deepEqual(_.select('1 -3 12 4', 'C D E F G A B'), [ 'C', null, null, 'F' ])
  t.deepEqual(_.select('-1 0 1 2 3', 'C D'), [ null, null, 'C', 'D', null ])
  t.end()
})
