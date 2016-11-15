var tape = require('tape')
var dict = require('..')

var DATA = {
  'maj7': ['1 3 5 7', ['Maj7']],
  'm7': ['1 b3 5 7']
}

tape('dictionary: get', function (test) {
  var get = dict.get(null, DATA)
  test.deepEqual(get('maj7'), [ '1', '3', '5', '7' ])
  test.deepEqual(get('Maj7'), [ '1', '3', '5', '7' ])
  test.deepEqual(get('m7'), [ '1', 'b3', '5', '7' ])
  test.equal(get('blah'), undefined)
  test.end()
})

tape('dictionary: keys', function (test) {
  var keys = dict.keys(DATA)
  test.deepEqual(keys(), [ 'maj7', 'm7' ])
  test.deepEqual(keys(true), [ 'maj7', 'm7', 'Maj7' ])
  test.end()
})
