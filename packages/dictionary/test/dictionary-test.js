var test = require('tape')
var d = require('..')

var DATA = {
  'maj7': ['1P 3M 5P 7M', ['Maj7']],
  'm7': ['1P 3m 5P 7m']
}
function split (str) { return str.split(' ') }

test('dictionary: detector', function (t) {
  var dict = d.dictionary(DATA, split)
  t.deepEqual(d.detector(dict, null)('E4 C4 B2 G5'), [ ['maj7', 'C'] ])
  t.deepEqual(d.detector(dict, '')('D4 b7 f#2 G5'), [ 'Gmaj7' ])
  t.deepEqual(d.detector(dict, ' ')('E C5 B G3'), [ 'C maj7' ])
  t.end()
})

test('dictionary: get', function (t) {
  var get = d.dictionary(DATA, split).get
  t.deepEqual(get('maj7'), [ '1P', '3M', '5P', '7M' ])
  t.deepEqual(get('Maj7'), [ '1P', '3M', '5P', '7M' ])
  t.deepEqual(get('m7'), [ '1P', '3m', '5P', '7m' ])
  t.equal(get('blah'), undefined)
  t.end()
})

test('dictionary: keys', function (t) {
  var keys = d.dictionary(DATA, split).keys
  t.deepEqual(keys(), [ 'maj7', 'm7' ])
  t.deepEqual(keys(true), [ 'maj7', 'm7', 'Maj7' ])
  t.end()
})

test('dictionry: keys with filter', function (t) {
  var keys = d.dictionary(DATA, split).keys
  var filter = function (name, intervals) {
    return intervals[1] === '3M'
  }
  t.deepEqual(keys(false, filter), [ 'maj7' ])
  t.deepEqual(keys(true, filter), [ 'maj7', 'Maj7' ])
  t.end()
})
