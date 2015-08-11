var vows = require('vows')
var assert = require('assert')
var name = require('../lib/note-name')

vows.describe('note').addBatch({
  'note name': function () {
    assert.equal(name('c'), 'C')
    assert.equal(name('c#'), 'C#')
    assert.equal(name('c#4'), 'C#')
  }
}).export(module)
