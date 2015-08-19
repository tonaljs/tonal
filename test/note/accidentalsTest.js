var vows = require('vows')
var assert = require('assert')
var accidentals = require('../../lib/note/accidentals')

vows.describe('Misc').addBatch({
  'accidentals': function () {
    assert.equal(accidentals(), '')
    assert.equal(accidentals(0), '')
    assert.equal(accidentals(1), '#')
    assert.equal(accidentals(-2), 'bb')
  }
}).export(module)
