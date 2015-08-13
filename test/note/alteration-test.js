var vows = require('vows')
var assert = require('assert')
var alteration = require('../../lib/note/alteration')

vows.describe('Note').addBatch({
  'note alteration': function () {
    assert.equal(alteration('C#2'), 1)
    assert.equal(alteration('bbb'), -2)
  }
}).export(module)
