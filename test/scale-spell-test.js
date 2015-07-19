var vows = require('vows')
var assert = require('assert')
var Tonal = require('../')
var spellData = require('./scale-intervals.json')

vows.describe('Scale intervals').addBatch({
  'major': function () {
    var intervals = Tonal.scale(2773).spell()
    assert.deepEqual(intervals, ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'])
  },
  'scale spell all scales': function () {
    var passed = 0
    Object.keys(spellData).forEach(function (name) {
      var expected = spellData[name]
      var intervals = Tonal.scale(name).spell().join(',')
      if (intervals === expected) passed++
    })
    assert.equal(passed, Object.keys(spellData).length)
  }
}).export(module)
