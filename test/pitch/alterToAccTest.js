var vows = require('vows')
var assert = require('assert')
var alterToAcc = require('../../lib/pitch/alterToAcc')

vows.describe('pitch/alterToAcc').addBatch({
  'accidentals': function () {
    assert.deepEqual(alterToAcc(0), '')
    assert.deepEqual(alterToAcc(1), '#')
    assert.deepEqual(alterToAcc(2), '##')
    assert.deepEqual(alterToAcc(-1), 'b')
    assert.deepEqual(alterToAcc(-2), 'bb')
  }
}).export(module)
