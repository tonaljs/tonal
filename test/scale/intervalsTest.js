var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/scale/intervals')
var scaleNames = require('../../lib/scale/scaleNames')

vows.describe('scale/intervals').addBatch({
  'all scale intervals': function () {
    scaleNames().forEach(function (name) {
      assert(intervals(name) !== null, 'Scale ' + name + ' should exist.')
    })
  }
}).export(module)
