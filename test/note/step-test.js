var vows = require('vows')
var assert = require('assert')
var step = require('../../lib/note/step')

vows.describe('Note').addBatch({
  'note step': function () {
    assert.equal(step('C#2'), 'C')
    assert.equal(step('bbb5'), 'B')
  }
}).export(module)
