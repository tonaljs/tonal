var vows = require('vows')
var assert = require('assert')
var find = require('../../lib/chord/find')

vows.describe('scale/find').addBatch({
  'first position chords': function () {
    assert.deepEqual(find('C E G'), ['CM', 'Em#5'])
    assert.deepEqual(find('G C E'), ['CM', 'Em#5'])
    assert.deepEqual(find('B C E G'), ['CMaj7'])
    assert.deepEqual(find('B E G'), ['Em'])
    assert.deepEqual(find('C Eb G Bb D'), ['Cm9'])
    assert.deepEqual(find(['G', 'B', 'D', 'F#']), ['GMaj7'])
  }
}).export(module)
