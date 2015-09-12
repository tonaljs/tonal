var vows = require('vows')
var assert = require('assert')
var props = require('../../lib/interval/props')
var _ = require('lodash')

function pluck (name, intervals) {
  return _.pluck(intervals.split(' ').map(props), name)
}

vows.describe('Interval').addBatch({
  'invalid intervals': function () {
    assert.equal(props('1M'), null)
    assert.equal(props('2P'), null)
    assert.equal(props('0P'), null)
    assert.equal(props('C#3'), null)
  },
  'quality': function () {
    assert.deepEqual(pluck('quality', '1d 1P 1A 2d 2m 2M 2A'),
      ['d', 'P', 'A', 'd', 'm', 'M', 'A'])
  },
  'direction': function () {
    assert.deepEqual(pluck('dir', '1P 2M -2m -8P'), [1, 1, -1, -1])
  },
  'number': function () {
    assert.deepEqual(pluck('num', '1P 2M 3M 4P 5P 6M 7M'), [1, 2, 3, 4, 5, 6, 7])
  },
  'octaves': function () {
    assert.deepEqual(pluck('oct', '1P 2M 3M 4P 5P 6M 7M 8P'),
      [0, 0, 0, 0, 0, 0, 0, 1])
    assert.deepEqual(pluck('oct', '1P 2M 3M 4P -5P -6M -7M'),
      [0, 0, 0, 0, 0, 0, 0])
    assert.deepEqual(pluck('oct', '-8P -9M -10M -11P 12P 13M 14M'),
      [1, 1, 1, 1, 1, 1, 1])
    assert.deepEqual(pluck('oct', '15P 16M 17M 18P -19P -20M -21M'),
      [2, 2, 2, 2, 2, 2, 2])
  },
  'perfectable': function () {
    assert.deepEqual(pluck('perfectable', '1P 2M 3M 4P 5P 6M 7M'),
      [true, false, false, true, true, false, false])
    assert.deepEqual(pluck('perfectable', '8P 9M 10M 11P 12P 13M 14M'),
      [true, false, false, true, true, false, false])
  },
  'alteration': function () {
    assert.deepEqual(pluck('alter', '1d 2m 3m 4d 5d 6m 7m'),
      [-1, -1, -1, -1, -1, -1, -1])
    assert.deepEqual(pluck('alter', '1P 2M 3M 4P 5P 6M 7M'),
      [0, 0, 0, 0, 0, 0, 0])
    assert.deepEqual(pluck('alter', '1A 2A 3A 4A 5A 6A 7A'),
      [1, 1, 1, 1, 1, 1, 1])
    assert.deepEqual(pluck('alter', '4ddd 4dd 4d 4P 4A 4AA 4AAA'),
      [undefined, -2, -1, 0, 1, 2, undefined])
    assert.deepEqual(pluck('alter', '2ddd 2dd 2d 2m 2M 2A 2AA 2AAA'),
      [undefined, -3, -2, -1, 0, 1, 2, undefined])
  },
  'semitones': function () {
    assert.deepEqual(pluck('semitones', '1P 2M 3M 4P 5P 6M 7M 8P'),
      [0, 2, 4, 5, 7, 9, 11, 12])
    assert.deepEqual(pluck('semitones', '1d 2m 3m 4d 5d 6m 7m'),
      [-1, 1, 3, 4, 6, 8, 10])
    assert.deepEqual(pluck('semitones', '1A 2A 3A 4A 5A 6A 7A'),
      [1, 3, 5, 6, 8, 10, 12])
    // compound
    assert.deepEqual(pluck('semitones', '8P 9M 10M 11P 12P 13M 14M 15P'),
      [12, 14, 16, 17, 19, 21, 23, 24])
    // descendent
    assert.deepEqual(pluck('semitones', '-1P -2M -3M -4P -5P -6M -7M'),
      [0, -2, -4, -5, -7, -9, -11])
    assert.deepEqual(pluck('semitones', '-8P -9M -10M -11P -12P -13M -14M -15P'),
      [-12, -14, -16, -17, -19, -21, -23, -24])
  }
}).export(module)
