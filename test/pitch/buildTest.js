var vows = require('vows')
var assert = require('assert')
var pitch = require('../../lib/pitch/build')

vows.describe('pitch/build').addBatch({
  'name as it': function () {
    assert.equal(pitch('Cx2').name, 'Cx2')
    assert.equal(pitch('bbb').name, 'bbb')
    assert.equal(pitch('f').name, 'f')
  },
  'set octaves': function () {
    assert.equal(pitch('Dbb5', 2).name, 'Dbb2')
  },
  'set accidentals': function () {
    assert.equal(pitch('C3', null, 1).name, 'C#3')
    assert.equal(pitch('C#3', null, -1).name, 'Cb3')
  },
  'set accidentals and octaves': function () {
    assert.equal(pitch('Dbb5', 2, 1).name, 'D#2')
  },
  'fast octave transpose': function () {
    var n = pitch('C4')
    assert.equal(pitch(n, n.oct + 1).name, 'C5')
    assert.equal(pitch(n, n.oct - 1).name, 'C3')
  }
}).export(module)
