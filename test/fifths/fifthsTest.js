var vows = require('vows')
var assert = require('assert')
var fifths = require('../../lib/fifths/fifths')

vows.describe('fifths/fifths').addBatch({
  'positive fifths from C': function () {
    assert.equal(fifths('C'), 0)
    assert.equal(fifths('G'), 1)
    assert.equal(fifths('F#'), 6)
    assert.equal(fifths('C#'), 7)
    assert.equal(fifths('C##'), 14)
  },
  'negative fifths from C': function () {
    assert.equal(fifths('F'), -1)
    assert.equal(fifths('Bb'), -2)
    assert.equal(fifths('Eb'), -3)
    assert.equal(fifths('Cb'), -7)
    assert.equal(fifths('Cbb'), -14)
  },
  'fifths from other notes': function () {
    assert.equal(fifths('F', 'F'), 0)
    assert.equal(fifths('F', 'D'), -3)
    assert.equal(fifths('F', 'Eb'), 2)
  },
  'octave is ignored': function () {
    assert.equal(fifths('C2', 'C4'), 0)
  }
}).export(module)
