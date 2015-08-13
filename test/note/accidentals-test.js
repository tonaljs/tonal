var vows = require('vows')
var assert = require('assert')
var accidentals = require('../../lib/note/accidentals')

vows.describe('Note').addBatch({
  'note accidentals': function () {
    assert.equal(accidentals('C#2'), '#')
    assert.equal(accidentals('bbb'), 'bb')
  }
}).export(module)
