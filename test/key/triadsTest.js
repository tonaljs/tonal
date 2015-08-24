var vows = require('vows')
var assert = require('assert')
var triads = require('../../lib/key/triads')
var name = require('../../lib/chord/name')

vows.describe('key/triads').addBatch({
  '3 note interval triads': function () {
    assert.deepEqual(triads('harmonic minor'), [
      [ 'P1', 'm3', 'P5' ],
      [ 'P1', 'm3', 'd5' ],
      [ 'P1', 'M3', 'A5' ],
      [ 'P1', 'm3', 'P5' ],
      [ 'P1', 'M3', 'P5' ],
      [ 'P1', 'M3', 'P5' ],
      [ 'P1', 'm3', 'd5' ]
    ])
    assert.deepEqual(triads('harmonic minor').map(name),
      ['m', 'ø', '#5', 'm', 'M', 'M', 'ø'])
  },
  '4 note triads': function () {
    assert.deepEqual(triads('C major', 4), [
      [ 'C4', 'E4', 'G4', 'B4' ],
      [ 'D4', 'F4', 'A4', 'C5' ],
      [ 'E4', 'G4', 'B4', 'D5' ],
      [ 'F4', 'A4', 'C5', 'E5' ],
      [ 'G4', 'B4', 'D5', 'F5' ],
      [ 'A4', 'C5', 'E5', 'G5' ],
      [ 'B4', 'D5', 'F5', 'A5' ]
    ])
  },
  '4 interval triads': function () {
    assert.deepEqual(triads('major', 4), [
      [ 'P1', 'M3', 'P5', 'M7' ],
      [ 'P1', 'm3', 'P5', 'm7' ],
      [ 'P1', 'm3', 'P5', 'm7' ],
      [ 'P1', 'M3', 'P5', 'M7' ],
      [ 'P1', 'M3', 'P5', 'm7' ],
      [ 'P1', 'm3', 'P5', 'm7' ],
      [ 'P1', 'm3', 'd5', 'm7' ]
    ])
    assert.deepEqual(triads('major', 4).map(name),
      ['Maj7', 'm7', 'm7', 'Maj7', '7', 'm7', '7b5'])
  },
  '5 interval triads': function () {
    //assert.deepEqual(triads('dorian', 5))
  }
}).export(module)
