var vows = require('vows')
var assert = require('assert')
var tonal = require('../lib/tonal')

vows.describe('tonal').addBatch({
  'tonal transpose': function () {
    assert.equal(tonal('E').transpose('2M'), 'F#4')
    assert.deepEqual(tonal('E F').transpose('2M'), [ 'F#4', 'G4' ])
  }
}).export(module)
