var vows = require('vows')
var assert = require('assert')
var scale = require('../../lib/scale/scale')
var names = require('../../lib/scale/names')

vows.describe('scale/scale').addBatch({
  'explicit tonic': function () {
    assert.deepEqual(scale('D', 'major'), ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'])
    assert.deepEqual(scale('C', 'minor'), ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'])
    assert.deepEqual(scale('F#', 'major'), ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'])
  },
  'implicit tonic': function () {
    assert.deepEqual(scale('D major'), ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'])
    assert.deepEqual(scale('Db major'), ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'])
    assert.deepEqual(scale('D## major'), ['D##', 'E##', 'F###', 'G##', 'A##', 'B##', 'C###'])
  },
  'scale intervals': function () {
    assert.deepEqual(scale('dorian b2'), ['1P', '2m', '3m', '4P', '5P', '6M', '7M'])
  },
  'invalid scales': function () {
    assert.equal(scale('C blah'), null)
  },
  'all scales': function () {
    names().forEach(function (name) {
      assert(scale(name) !== null, 'Chord ' + name + ' should exist.')
    })
  }
}).export(module)
