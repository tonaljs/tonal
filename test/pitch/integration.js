var vows = require('vows')
var assert = require('assert')
var scaleNames = require('../../lib/scale/names')
var scale = require('../../lib/scale/scale')
var distance = require('../../lib/pitch/interval')

vows.describe('interval/add').addBatch({
  'distance': function () {
    scaleNames().forEach(function (name) {
      var intervals = scale(name)
      var notes = scale('Cb ' + name)
      assert.equal(notes.map(distance.from('Cb')), intervals)
    })
  },
  'transpose': function () {
    scaleNames().forEach(function (name) {
    })
  }
})
