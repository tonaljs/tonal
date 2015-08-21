var vows = require('vows')
var assert = require('assert')
var note = require('../../lib/note/note')

vows.describe('note/note').addBatch({
  'normalize note': function () {
    assert.equal(note('C#2'), 'C#2')
    assert.equal(note('bbb'), 'Bbb4')
    assert.equal(note('f'), 'F4')
  },
  'set accidentals': function () {
    assert.equal(note('C3', 1), 'C#3')
    assert.equal(note('C#3', -1), 'Cb3')
  },
  'set octaves': function () {
    assert.equal(note('Dbb5', null, 2), 'Dbb2')
  },
  'set accidentals and octaves': function () {
    assert.equal(note('Dbb5', 1, 2), 'D#2')

  }
}).export(module)
