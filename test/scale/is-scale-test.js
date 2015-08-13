var vows = require('vows')
var assert = require('assert')
var isScale = require('../../lib/scale/is-scale')

vows.describe('midi').addBatch({
  'valid': function () {
    assert(isScale(['P1']), 'simplest scale')
    assert(isScale(['P1', 'P5']), 'two note scale')
  },
  'invalid': function () {
    assert(!isScale('Blah'), 'not an array')
    assert(!isScale(['Ea']), 'not an interval')
    assert(!isScale(['P5']), 'first interval must be P1')
    assert(!isScale(['P1', 'M-2']), 'descendent intervals not allowed')
  }
}).export(module)
