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

tape('encode notes or intervals', function (test) {
  // C#2 [0, 1, 2]
  test.deepEqual(n.encode(0, 1, 2), [ 7, -2 ])
  // Db
  test.deepEqual(n.encode(1, -1), [-5])
  // Db-1 [1, -1, -1]
  test.deepEqual(n.encode(1, -1, -1), [-5, 2])
  // 8A
  test.deepEqual(n.encode(0, 1, 1), [ 7, -3 ])
  // 9m
  test.deepEqual(n.encode(1, -1, 1), [ -5, 4 ])
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

tape('decode note or intervals', function (test) {
  test.deepEqual(n.decode(7, -2), [0, 1, 2])
  test.deepEqual(n.decode(-7, 4), [0, -1, 0])
  test.end()
})
