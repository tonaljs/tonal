var tape = require('tape')
var tonal = require('..')

tape('tonal', function (test) {
  test.ok(tonal, 'Tonal object')
  test.equal(Object.keys(tonal).length, 31, 'tonal exports count')
  Object.keys(tonal).forEach(function (name) {
    test.ok(tonal[name], 'Function ' + name)
  })
  test.end()
})
