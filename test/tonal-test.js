var tape = require('tape')
var tonal = require('..')

tape('tonal', function (test) {
  test.ok(tonal)
  test.equal(Object.keys(tonal).length, 29)
  test.end()
})
