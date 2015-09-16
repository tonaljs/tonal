var vows = require('vows')
var assert = require('assert')
var cents = require('../../lib/pitch/cents')

vows.describe('pitch/cents').addBatch({
  'pitch from key': function () {
    assert.equal(cents('A4', 'A#4'), 100)
    assert.equal(cents('A4', 444), 15.66)
  }
}).export(module)
