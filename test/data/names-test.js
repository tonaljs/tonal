var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/data/names')

vows.describe('Data').addBatch({
  'names': function () {
    var scaleNames = names({ major: 2773, minor: 2974 })
    assert.deepEqual(scaleNames(), ['major', 'minor'])
  }
}).export(module)
