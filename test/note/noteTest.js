var vows = require('vows')
var assert = require('assert')
var note = require('../../lib/note/note')

vows.describe('note/note').addBatch({
  'normalize note': function () {
    assert.equal(note('C#2').name, 'C#2')
    assert.equal(note('bbb').name, 'Bbb4')
    assert.equal(note('f').name, 'F4')
  },
  'set accidentals': function () {
    assert.equal(note('C3', 1).name, 'C#3')
    assert.equal(note('C#3', -1).name, 'Cb3')
  },
  'set octaves': function () {
    assert.equal(note('Dbb5', null, 2).name, 'Dbb2')
  },
  'set accidentals and octaves': function () {
    assert.equal(note('Dbb5', 1, 2).name, 'D#2')
  },
  'fast octave transpose': function () {
    var n = note('C4')
    assert.equal(note(n, null, n.oct + 1).name, 'C5')
    assert.equal(note(n, null, n.oct - 1).name, 'C3')
  }
}).export(module)
