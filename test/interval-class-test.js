var vows = require('vows')
var assert = require('assert')
var intervalClass = require('../lib/interval-class')

vows.describe('Interval class').addBatch({
  'simple interval classes': function () {
    var intervals = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8']
    var result = intervals.map(function (interval) {
      return interval + ' => ' + intervalClass(interval)
    })
    assert.deepEqual(result, [
      'P1 => 0', 'm2 => 1', 'M2 => 2', 'm3 => 3', 'M3 => 4',
      'P4 => 5', 'A4 => 6', 'd5 => 6', 'P5 => 5', 'm6 => 4',
      'M6 => 3', 'm7 => 2', 'M7 => 1', 'P8 => 0'])
  }
}).export(module)
