var vows = require('vows')
var assert = require('assert')
var accidentals = require('../../lib/misc/accidentals')

vows.describe('Misc').addBatch({
  'accidentals': function () {
    assert.equal(accidentals(1), '#')
    assert.equal(accidentals(-2), 'bb')
  }
}).export(module)
