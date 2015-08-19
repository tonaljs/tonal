var vows = require('vows')
var assert = require('assert')
var timeMeter = require('../../lib/time/time-meter')

vows.describe('time meter').addBatch({
  'signature': function () {
    var meter = timeMeter('3/4')
    assert.equal(meter.beats, 3)
    assert.equal(meter.subdivision, 4)
  }
}).export(module)
