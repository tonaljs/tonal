var vows = require('vows')
var assert = require('assert')
var transpose = require('../lib/transpose')

vows.describe('transpose').addBatch({
  'simple note transposition': function () {
    assert.equal(transpose('M2', 'c2'), 'D2')
    assert.equal(transpose('M-2', 'c2'), 'Bb1')
    assert.equal(transpose('A-2', 'c2'), 'Bbb1')
    assert.equal(transpose('M16', 'c2'), 'D4')
    assert.equal(transpose('M-16', 'c2'), 'Bb-1')
    assert.equal(transpose('M2', 'e2'), 'F#2')
    assert.equal(transpose('M3', 'A2'), 'C#3')
    assert.equal(transpose('d5', 'a2'), 'Eb3')
  }
}).export(module)
