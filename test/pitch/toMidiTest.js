var vows = require('vows')
var assert = require('assert')
var toMidi = require('../../lib/pitch/toMidi')

vows.describe('pitch/toMidi').addBatch({
  'pitch toMidi': function () {
    assert.deepEqual('C D E F G A B C'.split(' ').map(toMidi), [60, 62, 64, 65, 67, 69, 71, 60])
    assert.deepEqual('C# D# E# F# G# A# B# C#'.split(' ').map(toMidi), [61, 63, 65, 66, 68, 70, 72, 61])
    assert.deepEqual('C## D## E## F## G## A## B## C##'.split(' ').map(toMidi), [62, 64, 66, 67, 69, 71, 73, 62])
    assert.deepEqual('Cb Db Eb Fb Gb Ab Bb Cb'.split(' ').map(toMidi), [59, 61, 63, 64, 66, 68, 70, 59])
    assert.deepEqual('Cbb3 Dbb3 Ebb3 Fbb3 Gbb3 Abb3 Bbb3 Cbb3'.split(' ').map(toMidi), [46, 48, 50, 51, 53, 55, 57, 46])
  },
  'edge cases': function () {
    assert.equal(toMidi('B#3'), toMidi('C4'))
    assert.equal(toMidi('B##3'), toMidi('Db4'))
  }
}).export(module)
