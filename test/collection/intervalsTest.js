var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/collection/intervals')

vows.describe('collection/intervals').addBatch({
  'intervals with root': function () {
    assert.deepEqual(intervals('D3', 'E3 F#3'), ['2M', '3M'])
  },
  'intervals with no root': function () {
    assert.deepEqual(intervals('C2', ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2']),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
  }
}).export(module)
