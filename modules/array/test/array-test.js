var test = require('tape')
var _ = require('../')
function up (s) { return s.toUpperCase() }

test('map', function (t) {
  t.deepEqual(_.map(up, 'a bb cx'), [ 'A', 'BB', 'CX' ])
  var ups = _.map(up)
  t.deepEqual(ups('a bb cx'), [ 'A', 'BB', 'CX' ])
  t.end()
})

test('cMap', function (t) {
  function even (x) { return x % 2 ? null : x }
  t.deepEqual(_.cMap(even, [1, 2, 3, 4]), [ 2, 4 ])
  t.end()
})

test('compact', function (t) {
  t.deepEqual(_.compact(['a', null, 'b']), ['a', 'b'])
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
