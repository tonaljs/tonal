var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/chord/names')

vows.describe('scale/name').addBatch({
  'chord recognition': function () {
    assert.deepEqual(names('C E G'), ['CM', 'CMajor', 'C'])
    assert.equal(names('B C F G'), [''])
  }
}).export(module)
