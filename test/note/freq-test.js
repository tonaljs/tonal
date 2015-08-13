var vows = require('vows')
var assert = require('assert')
var freq = require('../../lib/note/freq')

vows.describe('Note').addBatch({
  'note freq': function () {
    assert.equal(freq('A4'), 440)
    assert.equal(freq('A3'), 220)
  },
  'custom tuning note freq': function () {
    assert.equal(freq('A4', 444), 444)
    assert.equal(freq('A3', 444), 222)
  }
}).export(module)
