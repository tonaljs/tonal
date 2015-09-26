var vows = require('vows')
var assert = require('assert')
var dictionary = require('../../lib/collection/dictionary')

vows.describe('collection/scale').addBatch({
  'find by key': function () {
    var chords = dictionary({'Maj7': '1P 3M 5P 7M'}, {'M7': 'Maj7'})
    assert.deepEqual(chords('Maj7'), ['1P', '3M', '5P', '7M'])
    assert.deepEqual(chords('M7'), ['1P', '3M', '5P', '7M'])
  },
  'filter': function () {
    var chords = dictionary({ major: '1P 3M 5P', minor: '1P 3m 5P' })
    assert.equal(chords(function (chord) {
      return chord[1] === '3M'
    }), 'major')
  }
}).export(module)
