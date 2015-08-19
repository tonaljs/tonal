var vows = require('vows')
var assert = require('assert')
var midi = require('../../lib/note/midi')

vows.describe('Note').addBatch({
  'note midi': function () {
    assert.equal(midi('C4'), 60)
    assert.equal(midi('A'), 69)
  }
}).export(module)
