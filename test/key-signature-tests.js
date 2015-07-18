var vows = require('vows')
var assert = require('assert')
var KeySignature = require('../key-signature')

vows.describe('Key keyature').addBatch({
  'by value': function () {
    var key = new KeySignature(1)
    assert.equal(key.number, 1)
    assert.equal(key.major, 'G')
    assert.equal(key.minor, 'E')
  },
  'F by tonic': function () {
    var key = new KeySignature('F')
    assert.equal(key.major, 'F')
    assert.equal(key.minor, 'D')
    assert.equal(key.number, -1)
  },
  'A#': function () {
    var key = new KeySignature('A#')
    assert.equal(key.number, 10)
    assert.equal(key.minor, 'G')
  },
  'signature': function () {
    assert.equal(KeySignature('Bb').signature, 'bb')
    assert.equal(KeySignature('Ab').signature, 'bbbb')
    assert.equal(KeySignature('D').signature, '##')
    assert.equal(KeySignature('E').signature, '####')
  },
  '# alterations': function () {
    assert.deepEqual(KeySignature('C').alterations(), [])
    assert.deepEqual(KeySignature('D').alterations(), ['F#', 'C#'])
    assert.deepEqual(KeySignature('E').alterations(), ['F#', 'C#', 'G#', 'D#'])
    assert.deepEqual(KeySignature('C#').alterations(), ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'])
    assert.deepEqual(KeySignature('D#').alterations(), ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#', 'F##', 'C##'])
  },
  'b alterations': function () {
    assert.deepEqual(KeySignature('F').alterations(), ['Bb'])
    assert.deepEqual(KeySignature('Ab').alterations(), ['Bb', 'Eb', 'Ab', 'Db'])
    assert.deepEqual(KeySignature('Cb').alterations(), ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'])
    assert.deepEqual(KeySignature('Fb').alterations(), ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb', 'Bbb'])
    assert.deepEqual(KeySignature('Bbb').alterations(), ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb', 'Bbb', 'Ebb'])
  }
}).export(module)
