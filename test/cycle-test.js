var vows = require('vows')
var assert = require('assert')
var cycle = require('../lib/cycle.js')

vows.describe('cycle').addBatch({
  '0 length': function () {
    assert.deepEqual(cycle('C', 'm2', 0), [])
  },
  '1 length': function () {
    assert.deepEqual(cycle('C', 'P5', 1), ['C'])
    assert.deepEqual(cycle('C', 'P5', -1), ['C'])
  },
  'cycle of fifths': function () {
    assert.equal(cycle('C', 'P5', 12).join(' '), 'C G D A E B F# C# G# D# A# E#')
    assert.equal(cycle('C', 'P5', -12).join(' '), 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb')
    // TODO: B## transpose P5 ¿what to do?
    assert.equal(cycle('C', 'P5', 8, 12).join(' '), 'B# F## C## G## D## A## E## B##')
    // TODO: Fbb transpose P-4 ¿what to do?
    assert.equal(cycle('C', 'P5', -4, 12).join(' '), 'Dbb Gbb Cbb Fbb')
  },
  'cycle offset': function () {
    assert.equal(cycle('C', 'P5', 3, 4).join(' '), 'E B F#')
  }
}).export(module)
