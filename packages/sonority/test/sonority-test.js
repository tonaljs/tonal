var test = require('tape')
var sonority = require('..')

test('sonority: density', function (t) {
  t.deepEqual(sonority.density('c e g b'), [ 2, 2, 1, 0, 1, 0 ])
  t.deepEqual(sonority.density('c d gb'), [ 0, 1, 0, 1, 0, 1 ])
  t.end()
})
