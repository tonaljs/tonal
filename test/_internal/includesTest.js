var vows = require('vows')
var assert = require('assert')
var includes = require('../../lib/_internal/includes')

vows.describe('Interval').addBatch({
  'includes': function () {
    assert.equal(includes('P1 M2'.split(' '), 'P1'), true)
  }
}).export(module)
