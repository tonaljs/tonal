var vows = require('vows')
var assert = require('assert')
var cycle = require('../lib/cycle.js')

vows.describe('cycle').addBatch({
  'cycle of fifths': function () {
    assert.equal(cycle('C', 'P5', 12).join(' '), 'C G D A E B F# C# G# D# A# E#')
    // TODO: B## transpose P5 ¿what?
    assert.equal(cycle('C', 'P5', 8, 12).join(' '), 'B# F## C## G## D## A## E## B##')
  },
  'cycle offset': function () {
    assert.equal(cycle('C', 'P5', 3, 4).join(' '), 'E B F#')
  }
}).export(module)
