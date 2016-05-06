var tape = require('tape')
var _ = require('../')
function up (s) { return s.toUpperCase() }

tape('harmonizer creates a function', function (test) {
  var maj7 = _.harmonizer('1P 3M 5P 7M')
  test.deepEqual(maj7('Bb'), [ 'Bb', 'D', 'F', 'A' ])
  test.end()
})
tape('filter nulls', function (test) {
  test.deepEqual(_.harmonize('C blah D', '7m'), [ 'Bb', 'C' ])
  test.deepEqual(_.harmonize(null, '7m'), [])
  test.end()
})
tape('null or false returns the pitches', function (test) {
  test.deepEqual(_.harmonize('c d e', null), [ 'C', 'D', 'E' ])
  test.end()
})
tape('harmonizes intervals by tonic', function (test) {
  test.deepEqual(_.harmonize('1P 3M 5P', 'A4'),
  [ 'A4', 'C#5', 'E5' ])
  test.end()
})
tape('harmonizes notes by interval', function (test) {
  test.deepEqual(_.harmonize('C E G', 'M3'),
  [ 'E', 'G#', 'B' ])
  test.end()
})
tape('splits list source', function (test) {
  test.deepEqual(_.map(up, 'a bb cx'),
  [ 'A', 'BB', 'CX' ])
  test.end()
})
tape('can be partially applied', function (test) {
  var ups = _.map(up)
  test.deepEqual(ups('a bb cx'),
  [ 'A', 'BB', 'CX' ])
  test.end()
})
tape('filter lists', function (test) {
  function isUpLetter (s) { return 'CDEFGAB'.indexOf(s[0]) !== -1 }
  test.deepEqual(_.filter(isUpLetter, 'C d f4 A4 M3'),
  [ 'C', 'A4' ])
  test.end()
})
tape('shuffles an array', function (test) {
  var s = _.shuffle('A B C D')
  test.equal(s.length, 4)
  test.notEqual(s.indexOf('A'), -1)
  test.notEqual(s.indexOf('B'), -1)
  test.notEqual(s.indexOf('C'), -1)
  test.notEqual(s.indexOf('D'), -1)
  test.end()
})
