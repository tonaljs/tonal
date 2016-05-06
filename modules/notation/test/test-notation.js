var tape = require('tape')
var n = require('..')

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
