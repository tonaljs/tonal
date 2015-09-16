var vows = require('vows')
var assert = require('assert')
var fromFreq = require('../../lib/pitch/fromFreq')

vows.describe('pitch/fromFreq').addBatch({
  'pitch from freq': function () {
    assert.equal(fromFreq(440), 'A4')
    assert.equal(fromFreq(220), 'A3')
    assert.equal(fromFreq(329.6275569128699), 'E4')
    assert.equal(fromFreq(330), 'E4')
    assert.equal(fromFreq(335), 'E4')
    assert.equal(fromFreq(340), 'F4')
    assert.equal(fromFreq(349.2282314330039), 'F4')
  },
  'custom tuning': function () {
    assert.equal(fromFreq(220, 220), 'A4')
  }
}).export(module)
