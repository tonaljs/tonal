var vows = require('vows')
var assert = require('assert')
var intervalNames = require('../lib/interval-names')

vows.describe('Interval names').addBatch({
  'all names': function () {
    assert.deepEqual(intervalNames(), ['d1', 'P1', 'A1', 'd2', 'm2', 'M2',
      'A2', 'd3', 'm3', 'M3', 'A3', 'd4', 'P4', 'A4', 'd5', 'P5', 'A5',
      'd6', 'm6', 'M6', 'A6', 'd7', 'm7', 'M7', 'A7', 'd8', 'P8', 'A8'])
  },
  'names by distance': function () {
    assert.deepEqual(intervalNames(7), ['P5', 'd6'])
  }
}).export(module)
