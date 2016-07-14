var test = require('tape')
var _ = require('../')
function up (s) { return s.toUpperCase() }

test('asArr', function (t) {
  t.deepEqual(_.asArr('a b c'), [ 'a', 'b', 'c' ])
  t.deepEqual(_.asArr('a |  b    |  c   '), ['a', 'b', 'c'])
  t.deepEqual(_.asArr('a , b  | c    d'), ['a', 'b', 'c', 'd'])
  t.end()
})

test('map', function (t) {
  t.deepEqual(_.map(up, 'a bb cx'), [ 'A', 'BB', 'CX' ])
  var ups = _.map(up)
  t.deepEqual(ups('a bb cx'), [ 'A', 'BB', 'CX' ])
  t.end()
})

test('cMap', function (t) {
  function even (x) { return x % 2 ? null : x }
  t.deepEqual(_.cMap(even, [1, 2, 3, 4]), [ 2, 4 ])
  t.deepEqual(_.cMap(even, [-2, -1, 0, 1, 2, 3, 4]), [ -2, 0, 2, 4 ])
  t.end()
})

test('compact', function (t) {
  t.deepEqual(_.compact(['a', null, 'b']), ['a', 'b'])
  t.deepEqual(_.compact([0, 1, 2, 3, null, 4]), [ 0, 1, 2, 3, 4 ])
  t.end()
})

test('filter', function (t) {
  function isUpLetter (s) { return 'CDEFGAB'.indexOf(s[0]) !== -1 }
  t.deepEqual(_.filter(isUpLetter, 'C d f4 A4 M3'),
  [ 'C', 'A4' ])
  t.end()
})

test('shuffle', function (t) {
  var s = _.shuffle('A B C D')
  t.equal(s.length, 4)
  t.notEqual(s.indexOf('A'), -1)
  t.notEqual(s.indexOf('B'), -1)
  t.notEqual(s.indexOf('C'), -1)
  t.notEqual(s.indexOf('D'), -1)
  t.end()
})

test('harmonics', function (t) {
  t.deepEqual(_.harmonics('C E G'), [ '1P', '3M', '5P' ])
  t.deepEqual(_.harmonics('C2 E3 G4'), [ '1P', '10M', '19P' ])
  t.deepEqual(_.harmonics('x y z'), [])
  t.end()
})

test('harmonizer', function (t) {
  t.deepEqual(_.harmonize('1P 3M 5P', 'A4'), [ 'A4', 'C#5', 'E5' ])
  t.deepEqual(_.harmonize('C E G', 'M3'), [ 'E', 'G#', 'B' ])

  t.deepEqual(_.harmonize('C blah D', '7m'), [ 'Bb', 'C' ])
  t.deepEqual(_.harmonize(null, '7m'), [])
  t.deepEqual(_.harmonize('c d e', null), [ 'C', 'D', 'E' ])

  var maj7 = _.harmonizer('1P 3M 5P 7M')
  t.deepEqual(maj7('Bb'), [ 'Bb', 'D', 'F', 'A' ])
  t.end()
})

test('rotate', function (t) {
  t.deepEqual(_.rotate(1, 'c d e'), ['d', 'e', 'c'])
  t.deepEqual(_.rotate(-1, 'c d e'), [ 'e', 'c', 'd' ])
  t.deepEqual(_.rotate(0, 'c d e'), [ 'c', 'd', 'e' ])
  t.end()
})

test('rotateAsc', function (t) {
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
