/* global describe it */
var assert = require('assert')
var key = require('..')

describe('key.chords', function () {
  it('chords of major', function () {
    assert.deepEqual(key.chords('C major'), [ 'CM', 'Dm', 'Em', 'FM', 'G7', 'Am', 'Bdim' ])
    assert.deepEqual(key.chords('Bb major'), ['BbM', 'Cm', 'Dm', 'EbM', 'F7', 'Gm', 'Adim'])
  })
  it('chords of minor', function () {
    assert.deepEqual(key.chords('E minor'), ['Em', 'F#dim', 'GM', 'Am', 'Bm', 'CM', 'D7'])
  })
})
