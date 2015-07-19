var vows = require('vows')
var assert = require('assert')
var Tonal = require('../')

vows.describe('Scale notes').addBatch({
  'major': function () {
    assert.equal(Tonal.scale('major').notes('D4').join(' '), 'D4 E4 F#4 G4 A4 B4 C#5')
  },
  '111000001111': function () {
    var scale = Tonal.scale('111000001111')
    assert.equal(scale.spell().join(','), 'P1,m2,M2,A5,M6,A6,M7')
  }
}).export(module)
