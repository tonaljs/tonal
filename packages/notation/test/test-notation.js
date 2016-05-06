var tape = require('tape')
var n = require('..')

tape('encode pitch classes', function (test) {
  test.deepEqual([0, 1, 2, 3, 4, 5, 6].map(function (e) { return n.encode(e, 0) }),
    [ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ], [ 3 ], [ 5 ] ])
  test.deepEqual([0, 1, 2, 3, 4, 5, 6].map(function (e) { return n.encode(e, 1) }),
    [ [ 7 ], [ 9 ], [ 11 ], [ 6 ], [ 8 ], [ 10 ], [ 12 ] ])
  test.deepEqual([0, 1, 2, 3, 4, 5, 6].map(function (e) { return n.encode(e, -1) }),
    [ [ -7 ], [ -5 ], [ -3 ], [ -8 ], [ -6 ], [ -4 ], [ -2 ] ])
  test.end()
})

tape('decode pitch class', function (test) {
  function dec (e) { return n.decode.apply(null, e) }
  test.deepEqual([ [ 0 ], [ 2 ], [ 4 ], [ -1 ], [ 1 ], [ 3 ], [ 5 ] ].map(dec),
    [ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ 4, 0 ], [ 5, 0 ], [ 6, 0 ] ])
  test.deepEqual([ [ 7 ], [ 9 ], [ 11 ], [ 6 ], [ 8 ], [ 10 ], [ 12 ] ].map(dec),
    [ [ 0, 1 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ], [ 4, 1 ], [ 5, 1 ], [ 6, 1 ] ])
  test.deepEqual([ [ -7 ], [ -5 ], [ -3 ], [ -8 ], [ -6 ], [ -4 ], [ -2 ] ].map(dec),
    [ [ 0, -1 ], [ 1, -1 ], [ 2, -1 ], [ 3, -1 ], [ 4, -1 ], [ 5, -1 ], [ 6, -1 ] ])
  test.end()
})

tape('letter to step', function (test) {
  test.deepEqual('ABCDEFGHIJKLMNO'.split('').map(n.toStep),
    [ 5, 6, 0, 1, 2, 3, 4, null, null, null, null, null, null, null, null ])
  test.deepEqual('abcdefghijklmno'.split('').map(n.toStep),
    [ 5, 6, 0, 1, 2, 3, 4, null, null, null, null, null, null, null, null ])
  test.deepEqual('123456789'.split('').map(n.toStep),
    [ null, null, null, null, null, null, null, null, null ])
  test.end()
})

tape('step to letter', function (test) {
  test.deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n.toLetter),
    [ 'C', 'D', 'E', 'F', 'G', 'A', 'B', null, null, null, null ])
  test.end()
})

tape('toAlt', function (test) {
  test.deepEqual([ 'bbbb', 'bbb', 'bb', 'b', '', '#', '##', '###', '####' ].map(n.toAlt),
    [ -4, -3, -2, -1, 0, 1, 2, 3, 4 ])
  test.end()
})

tape('toAcc', function (test) {
  test.deepEqual([-4, -3, -2, -1, 0, 1, 2, 3, 4].map(n.toAcc),
    [ 'bbbb', 'bbb', 'bb', 'b', '', '#', '##', '###', '####' ])
  test.end()
})
