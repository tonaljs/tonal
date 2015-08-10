var vows = require('vows')
var assert = require('assert')
var data = require('./scale-intervals.json')
var Tonal = require('../')
var intervals = require('../scale-intervals.js')

vows.describe('Scale intervals').addBatch({
  'toBinary': function () {
    Object.keys(data).forEach(function (name) {
      var scale = Tonal.scale(name)
      var binary = intervals.toBinary(data[name])
      if (scale.binary !== binary) console.log(name, data[name], scale.binary, binary)
      assert.equal(scale.binary, binary)
    })
  }
}).export(module)
