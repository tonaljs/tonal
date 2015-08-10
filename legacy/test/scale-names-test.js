var vows = require('vows')
var assert = require('assert')
var Tonal = require('../')

vows.describe('Scales').addBatch({
  'scale by name': function () {
    assert.equal(Tonal.scale('major').decimal, 2773)
  },
  'scale by decimal': function () {
    assert.deepEqual(Tonal.scale(2773), Tonal.scale('major'))
  },
  'scale has names': function () {
    assert.deepEqual(Tonal.scale('major').names(), ['major', 'ionian'])
  },
  'all scales': function () {
    assert.equal(Tonal.Scale.all().length, 2048)
  }
}).export(module)
