var vows = require('vows')
var assert = require('assert')
var freq = require('../lib/freq')

vows.describe('freq').addBatch({
  'note freq': function () {
    assert.equal(freq('a4'), 440)
    assert.equal(freq('a3'), 220)
    assert.equal(freq('a2'), 110)
    assert.equal(freq('c4'), 261.6255653005986)
  },
  'custom tuning': function () {
    assert.equal(freq('a4', 444), 444)
    assert.equal(freq('a3', 448), 224)
  }
}).export(module)
