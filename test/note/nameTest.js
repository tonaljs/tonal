var vows = require('vows')
var assert = require('assert')
var name = require('../../lib/note/name')

vows.describe('Note').addBatch({
  'pitch name': function () {
    assert.equal(name('C#2'), 'C#')
    assert.equal(name('bbb5'), 'Bbb')
  }
}).export(module)
