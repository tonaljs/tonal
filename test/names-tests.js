var vows = require('vows')
var assert = require('assert')
var intervalNames = require('../lib/interval-names')

function range (a, b, step) {
  step = step || 1
  var r = []
  for (var x = a; (b - x) * step > 0; x += step) {
    r.push(x)
  }
  return r
}

vows.describe('Intervals').addBatch({
  'all names': function () {
    assert.deepEqual(intervalNames(), ['d1', 'P1', 'A1', 'd2', 'm2', 'M2', 'A2',
    'd3', 'm3', 'M3', 'A3', 'd4', 'P4', 'A4', 'd5', 'P5', 'A5', 'd6', 'm6', 'M6', 'A6',
    'd7', 'm7', 'M7', 'A7', 'd8', 'P8', 'A8'])
  },
  'simple ascending': function () {
    var names = range(0, 12).map(function (dist) { return intervalNames(dist) })
    assert.deepEqual(names, [[ 'P1', 'd2' ], [ 'A1', 'm2' ], [ 'M2', 'd3' ],
    [ 'A2', 'm3' ], [ 'M3', 'd4' ], [ 'A3', 'P4' ], [ 'A4', 'd5' ],
    [ 'P5', 'd6' ], [ 'A5', 'm6' ], [ 'M6', 'd7' ], [ 'A6', 'm7' ], [ 'M7', 'd8' ]])
  },
  'simple descending': function () {
    var names = range(0, -12, -1).map(function (dist) { return intervalNames(dist) })
    assert.deepEqual(names, [[ 'P1', 'd2' ], [ 'A-1', 'm-2' ], [ 'M-2', 'd-3' ],
    [ 'A-2', 'm-3' ], [ 'M-3', 'd-4' ], [ 'A-3', 'P-4' ], [ 'A-4', 'd-5' ],
    [ 'P-5', 'd-6' ], [ 'A-5', 'm-6' ], [ 'M-6', 'd-7' ], [ 'A-6', 'm-7' ], [ 'M-7', 'd-8' ]])
  }
}).export(module)
