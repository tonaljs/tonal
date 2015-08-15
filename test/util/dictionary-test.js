var vows = require('vows')
var assert = require('assert')
var dictionary = require('../../lib/utils/dictionary')

vows.describe('Set').addBatch({
  'dictionary': function () {
    var plain = function (value) { return value }
    assert.equal(plain('a'), 'a')
    var decorated = dictionary({'a': 100}, plain)
    assert.equal(decorated('a'), 100)
  },
  'dictionary with position': function () {
    var plain = function (first, second) { return first + second }
    assert.equal(plain('a', 'b'), 'ab')
    var decorated = dictionary({'b': 100}, plain, 1)
    assert.equal(decorated('a', 'b'), 'a100')

  }
}).export(module)
