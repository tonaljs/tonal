var vows = require('vows')
var assert = require('assert')
var toFreq = require('../../lib/pitch/toFreq')

vows.describe('pitch/toFreq').addBatch({
  'number toFreq': function () {
    assert.equal(toFreq('440'), 440)
    assert.equal(toFreq(1), 1)
    assert.equal(toFreq(329.62), 329.62)
  },
  'pitch toFreq': function () {
    assert.equal(toFreq('A4'), 440)
    assert.equal(toFreq('A3'), 220)
    assert.equal(toFreq('E4'), 329.6275569128699)
    assert.equal(toFreq('F4'), 349.2282314330039)
  },
  'custom tuning pitch toFreq': function () {
    assert.equal(toFreq('A4', 444), 444)
    assert.equal(toFreq('A3', 444), 222)
  }
}).export(module)
