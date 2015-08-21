var vows = require('vows')
var assert = require('assert')
var opposite = require('../../lib/interval/opposite')

vows.describe('interval/opposite').addBatch({
  'opposite interval': function () {
    assert.equal(opposite('P1'), 'P-1')
    assert.equal(opposite('M2'), 'M-2')
    assert.equal(opposite('M-2'), 'M2')
    assert.equal(opposite('M-9'), 'M9')
    assert.equal(opposite('M14'), 'M-14')
    assert.equal(opposite('A-14'), 'A14')
  }
}).export(module)
