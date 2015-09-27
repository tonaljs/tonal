var vows = require('vows')
var assert = require('assert')
var tonal = require('../lib/index')

vows.describe('tonal').addBatch({
  'pitch': function () {
    assert.equal(tonal.sci('ebb2'), 'Ebb2')
    assert.equal(tonal.octave('bb3'), 3)
    assert.equal(tonal.pitchClass('bb3'), 'Bb')
    assert.equal(tonal.toMidi('bb3'), 58)
    assert.equal(tonal.fromMidi(87), 'Eb6')
    assert.equal(tonal.toFreq('Eb6'), 1244.5079348883237)
  },
  'scales': function () {
    assert.deepEqual(tonal.scale('Bb', 'dorian'), ['Bb', 'C', 'Db', 'Eb', 'F', 'G', 'Ab'])
  },
  'collections': function () {
    assert.deepEqual(tonal('A B C'), ['A', 'B', 'C'])
    assert.deepEqual(tonal('C D E').map(tonal.transpose('-2M')), ['Bb3', 'C4', 'D4'])
  }
}).export(module)
