var vows = require('vows')
var assert = require('assert')
var pitch = require('../../lib/pitch/sci')

vows.describe('pitch/sci').addBatch({
  'scientific notation': function () {
    assert.equal(pitch('Cx2'), 'C##2')
    assert.equal(pitch('bbb'), 'Bbb4')
    assert.equal(pitch('f'), 'F4')
  },
  'set octaves': function () {
    assert.equal(pitch('Dbb5', null, 2), 'Dbb2')
  },
  'set accidentals': function () {
    assert.equal(pitch('C3', '#', null), 'C#3')
    assert.equal(pitch('C3', 1, null), 'C#3')
    assert.equal(pitch('C#3', -1, null), 'Cb3')
    assert.equal(pitch('C', '#####', null), null)
  },
  'set accidentals and octaves': function () {
    assert.equal(pitch('Dbb5', 1, 2), 'D#2')
  }
}).export(module)
