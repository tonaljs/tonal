var vows = require('vows')
var assert = require('assert')
var distance = require('../../lib/fifths/distance')

vows.describe('fifths/distance').addBatch({
  'positive distances from C': function () {
    assert.equal(distance('C'), 0)
    assert.equal(distance('G'), 1)
    assert.equal(distance('F#'), 6)
    assert.equal(distance('C#'), 7)
    assert.equal(distance('C##'), 14)
  },
  'negative distances from C': function () {
    assert.equal(distance('F'), -1)
    assert.equal(distance('Bb'), -2)
    assert.equal(distance('Eb'), -3)
    assert.equal(distance('Cb'), -7)
    assert.equal(distance('Cbb'), -14)
  },
  'distances from other notes': function () {
    assert.equal(distance('F', 'F'), 0)
    assert.equal(distance('F', 'D'), -3)
    assert.equal(distance('F', 'Eb'), 2)
  }
}).export(module)
