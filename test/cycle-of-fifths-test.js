var vows = require('vows')
var assert = require('assert')
var cycle = require('../lib/cycle-of-fifths.js')

vows.describe('cycle of fifths').addBatch({
  'with positive numbers': function () {
    assert.equal(cycle(0), 'C')
    assert.equal(cycle(6), 'F#')
    assert.equal(cycle(7), 'C#')
    assert.equal(cycle(11), 'E#')
    assert.equal(cycle(12), 'C')
  },
  'with negative numbers': function () {
    assert.equal(cycle(-1), 'F')
    assert.equal(cycle(-2), 'Bb')
    assert.equal(cycle(-7), 'Cb')
    assert.equal(cycle(-11), 'Abb')
    assert.equal(cycle(-12), 'C')
    assert.equal(cycle(-13), 'F')
  },
  'with notes': function () {
    assert.equal(cycle('C'), 0)
    assert.equal(cycle('G'), 1)
    assert.equal(cycle('F'), -1)
  }
}).export(module)
