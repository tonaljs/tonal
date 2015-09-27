var vows = require('vows')
var assert = require('assert')
var scaleNames = require('../../lib/chord/scaleNames')
var names = require('../../lib/chord/names')

vows.describe('scale/scaleNames').addBatch({
  'get scale names': function () {
    assert.deepEqual(scaleNames(null, 'M7b5'), ['1P lydian', '5d locrian pentatonic'])
    assert.deepEqual(scaleNames('M7b5'), ['1P lydian', '5d locrian pentatonic'])
  },
  'scale names explicit tonic': function () {
    assert.deepEqual(scaleNames('D', 'M7b5'), [ 'D4 lydian', 'Ab4 locrian pentatonic' ])
  },
  'scale names implitic tonic': function () {
    assert.deepEqual(scaleNames('F#M7b5'), ['F#4 lydian', 'C5 locrian pentatonic'])
  },
  'no scale names': function () {
    assert.deepEqual(scaleNames('C', 'blah'), [])
  },
  'all chord scale names': function () {
    names().forEach(function (chord) {
      assert.equal(scaleNames(null, chord).length, scaleNames('E#', chord).length)
    })
  }
}).export(module)
