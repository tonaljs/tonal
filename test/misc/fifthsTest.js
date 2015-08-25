var vows = require('vows')
var assert = require('assert')
var fifths = require('../../lib/misc/fifths.js')

vows.describe('fifths of fifths').addBatch({
  'with positive numbers': function () {
    assert.equal(fifths(0), 'C')
    assert.equal(fifths(6), 'F#')
    assert.equal(fifths(7), 'C#')
    assert.equal(fifths(11), 'E#')
    assert.equal(fifths(12), 'C')
  },
  'with negative numbers': function () {
    assert.equal(fifths(-1), 'F')
    assert.equal(fifths(-2), 'Bb')
    assert.equal(fifths(-7), 'Cb')
    assert.equal(fifths(-11), 'Abb')
    assert.equal(fifths(-12), 'C')
    assert.equal(fifths(-13), 'F')
  },
  'with notes': function () {
    assert.equal(fifths('C'), 0)
    assert.equal(fifths('g'), 1)
    assert.equal(fifths('G#'), 8)
    assert.equal(fifths('F4'), -1)
  }
}).export(module)
