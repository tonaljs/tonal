var vows = require('vows')
var assert = require('assert')
var intervals = require('../../lib/chord/intervals')
var chordNames = require('../../lib/chord/chordNames')

vows.describe('chord/intervals').addBatch({
  'all chord intervals': function () {
    chordNames().forEach(function (name) {
      assert(intervals(name) !== null, 'Chord ' + name + ' should exist.')
    })
  }
}).export(module)
