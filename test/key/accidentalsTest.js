var vows = require('vows')
var assert = require('assert')
var accidentals = require('../../lib/key/accidentals')

vows.describe('key/accidentals').addBatch({
  'accidentals': function () {
    assert.deepEqual(accidentals('C major'), '')
    assert.deepEqual(accidentals('g#'), '########')
    assert.deepEqual(accidentals('bb major'), 'bb')
    assert.deepEqual(accidentals('eb major'), 'bbb')
    assert.deepEqual(accidentals('E minor'), '#')
    assert.deepEqual(accidentals('G minor'), 'bb')
    assert.deepEqual(accidentals('Eb minor'), 'bbbbbb')
  },
  'by number': function () {
    assert.deepEqual(accidentals(1), '#')
  }
}).export(module)
