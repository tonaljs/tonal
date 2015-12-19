/* global describe it */
var assert = require('assert')
var key = require('..')

describe('key.progression', function () {
  it('progression of major', function () {
    assert.deepEqual(key.progression('ii V I', 'C major'),
      [ 'Dm', 'G7', 'CM' ])
    assert.deepEqual(key.progression('ii V I', 'Bb major'),
      [ 'Cm', 'F7', 'BbM' ])
    assert.deepEqual(key.progression('i ii biii', 'Bb major'),
      [ 'BbM', 'Cm', null ])
  })
  it('progression of minor', function () {
    assert.deepEqual(key.progression('II V I', 'C minor'),
      [ 'Ddim', 'Gm', 'Cm' ])
    assert.deepEqual(key.progression('I II bIII III IV', 'D minor'),
      ['Dm', 'Edim', 'FM', null, 'Gm'])
  })
  it('use bars as separators', function () {
    assert.deepEqual(key.progression('II V | I', 'Ab major'),
      ['Bbm', 'Eb7', 'AbM'])
  })
  it('upper or lower case is irrelevant', function () {
    assert.deepEqual(key.progression('II V I', 'C major'), key.progression('ii v i', 'C major'))
  })
})
