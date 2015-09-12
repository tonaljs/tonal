var vows = require('vows')
var assert = require('assert')
var invert = require('../../lib/interval/invert')

vows.describe('Interval').addBatch({
  'basic inversion': function () {
    assert.equal(invert('2M'), '7m')
  },
  'force ascending': function () {
    assert.equal(invert('-2M', true), '7m')
  },
  'simple inversions': function () {
    assert.deepEqual('1P 2M 3M 4P 5P 6M 7M'.split(' ').map(invert),
      ['8P', '7m', '6m', '5P', '4P', '3m', '2m'])
    assert.deepEqual('-1P -2M -3M -4P -5P -6M -7M'.split(' ').map(invert),
      ['-8P', '-7m', '-6m', '-5P', '-4P', '-3m', '-2m'])
  },
  'compound inversions': function () {
    assert.deepEqual('1P 9M 10M 11P 12P 13M 14M'.split(' ').map(invert),
      ['8P', '7m', '6m', '5P', '4P', '3m', '2m'])
    assert.deepEqual('-1P -9M -10M -11P -12P -13M -14M'.split(' ').map(invert),
      ['-8P', '-7m', '-6m', '-5P', '-4P', '-3m', '-2m'])
  }
}).export(module)
