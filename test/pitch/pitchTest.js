var vows = require('vows')
var assert = require('assert')
var pitch = require('../../lib/pitch/pitch')

vows.describe('pitch/pitch').addBatch({
  'normalize pitch': function () {
    assert.equal(pitch('C#2').name, 'C#2')
    assert.equal(pitch('bbb').name, 'Bbb4')
    assert.equal(pitch('f').name, 'F4')
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
