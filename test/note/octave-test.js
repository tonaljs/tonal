var vows = require('vows')
var assert = require('assert')
var octave = require('../../lib/note/octave')

vows.describe('Note').addBatch({
  'pitch octave': function () {
    assert.equal(octave('C#2'), 2)
    assert.equal(octave('D'), 4)
    assert.equal(octave('bbb5'), 5)
  }
}).export(module)
