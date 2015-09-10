var vows = require('vows')
var assert = require('assert')
var name = require('../../lib/scale/name')

vows.describe('scale/name').addBatch({
  'scale names': function () {
    assert.equal(name('C D E F G A B'), 'C4 ionian')
  }
}).export(module)
