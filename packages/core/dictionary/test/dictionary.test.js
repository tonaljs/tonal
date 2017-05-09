/* global describe test expect */
var d = require('..')

var DATA = {
  'maj7': ['1P 3M 5P 7M', ['Maj7']],
  'm7': ['1P 3m 5P 7m']
}
function split (str) { return str.split(' ') }

describe('tonal-dictionary', () => {
  test('detector', () => {
    var dict = d.dictionary(DATA, split)
    expect(d.detector(dict, null)('E4 C4 B2 G5')).toEqual([ ['maj7', 'C'] ])
    expect(d.detector(dict, '')('D4 b7 f#2 G5')).toEqual([ 'Gmaj7' ])
    expect(d.detector(dict, ' ')('E C5 B G3')).toEqual([ 'C maj7' ])
  })

  test('create a dictionary', () => {
    var DATA = { 'M': ['1P 3M 5P'] }
    expect(d.dictionary(DATA).get('M')).toEqual('1P 3M 5P')
    expect(d.dictionary(DATA, split).get('M')).toEqual(['1P', '3M', '5P'])
  })

  test('get', () => {
    var get = d.dictionary(DATA, split).get
    expect(get('maj7')).toEqual([ '1P', '3M', '5P', '7M' ])
    expect(get('Maj7')).toEqual([ '1P', '3M', '5P', '7M' ])
    expect(get('m7')).toEqual([ '1P', '3m', '5P', '7m' ])
    expect(get('blah')).toBe(undefined)
  })

  test('keys', () => {
    var keys = d.dictionary(DATA, split).keys
    expect(keys()).toEqual([ 'maj7', 'm7' ])
    expect(keys(true)).toEqual([ 'maj7', 'm7', 'Maj7' ])
  })

  test('dictionry: keys with filter', () => {
    var keys = d.dictionary(DATA, split).keys
    var filter = function (name, intervals) {
      return intervals[1] === '3M'
    }
    expect(keys(false, filter)).toEqual([ 'maj7' ])
    expect(keys(true, filter)).toEqual([ 'maj7', 'Maj7' ])
  })
})
