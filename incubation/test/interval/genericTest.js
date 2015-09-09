var vows = require('vows')
var assert = require('assert')
var generic = require('../../lib/interval/generic')

vows.describe('interval/generic').addBatch({
  'opposite interval': function () {
    assert.deepEqual(generic(1), { num: 0, perfectable: true })
  }
}).export(module)
