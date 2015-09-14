var vows = require('vows')
var assert = require('assert')
var pitch = require('../../lib/pitch/pitch')

vows.describe('pitch/pitch').addBatch({
  'scientific notation': function () {
    assert.equal(pitch('Cx2'), 'C##2')
    assert.equal(pitch('bbb'), 'Bbb4')
    assert.equal(pitch('f'), 'F4')
  },
  'set octaves': function () {
    assert.equal(pitch('Dbb5', 2), 'Dbb2')
  },
  'set accidentals': function () {
    assert.equal(pitch('C3', null, 1), 'C#3')
    assert.equal(pitch('C#3', null, -1), 'Cb3')
  },
  'set accidentals and octaves': function () {
    assert.equal(pitch('Dbb5', 2, 1), 'D#2')
  }
}).export(module)
