var vows = require('vows')
var assert = require('assert')
var freq = require('../../lib/pitch/freq')

vows.describe('pitch/freq').addBatch({
  'pitch freq': function () {
    assert.equal(freq('A4'), 440)
    assert.equal(freq('A3'), 220)
    assert.equal(freq('E4'), 329.6275569128699)
    assert.equal(freq('F4'), 349.2282314330039)
  },
  'custom tuning pitch freq': function () {
    assert.equal(freq('A4', 444), 444)
    assert.equal(freq('A3', 444), 222)
  }
}).export(module)
