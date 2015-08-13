var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/scale/intervals')
var dictionary = require('../../lib/utils/dictionary')

vows.describe('Scale').addBatch({
  'scale intervals': function () {
    assert.deepEqual(intervals(2773), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'with dictionary': function () {
    var data = {'test': ['P1', 'P5'], 'ionian': 2773}
    intervals = dictionary(data, intervals)
    assert.deepEqual(intervals('test'), ['P1', 'P5'])
    assert.deepEqual(intervals('ionian'), ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  }
}).export(module)
