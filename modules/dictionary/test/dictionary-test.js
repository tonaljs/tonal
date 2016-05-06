var tape = require('tape')
var dict = require('..')

var DATA = {
  'maj7': ['1 3 5 7', ['Maj7']],
  'm7': ['1 b3 5 7']
}

tape('get from name', function (test) {
  var fromName = dict.fromName(null, DATA)
  test.deepEqual(fromName('maj7'), [ '1', '3', '5', '7' ])
  test.deepEqual(fromName('Maj7'), [ '1', '3', '5', '7' ])
  test.deepEqual(fromName('m7'), [ '1', 'b3', '5', '7' ])
  test.equal(fromName('blah'), undefined)
  test.end()
})

tape('get names', function (test) {
  var names = dict.names(DATA)
  test.deepEqual(names(), [ 'maj7', 'm7' ])
  test.deepEqual(names(true), [ 'maj7', 'm7', 'Maj7' ])
  test.end()
})
