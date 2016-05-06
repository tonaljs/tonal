var tape = require('tape')
var n = require('..')

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
