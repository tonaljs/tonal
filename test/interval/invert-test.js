var vows = require('vows')
var assert = require('assert')
var set = require('../../lib/set/set')
var invert = require('../../lib/interval/invert')

vows.describe('Interval').addBatch({
  'simple inversions': function () {
    assert.deepEqual(set('P1 M2 M3 P4 P5 M6 M7').map(invert),
      ['P8', 'm7', 'm6', 'P5', 'P4', 'm3', 'm2'])
    assert.deepEqual(set('P-1 M-2 M-3 P-4 P-5 M-6 M-7').map(invert),
      ['P-8', 'm-7', 'm-6', 'P-5', 'P-4', 'm-3', 'm-2'])
  },
  'compound inversions': function () {
    assert.deepEqual(set('P1 M9 M10 P11 P12 M13 M14').map(invert),
      ['P8', 'm7', 'm6', 'P5', 'P4', 'm3', 'm2'])
    assert.deepEqual(set('P-1 M-9 M-10 P-11 P-12 M-13 M-14').map(invert),
      ['P-8', 'm-7', 'm-6', 'P-5', 'P-4', 'm-3', 'm-2'])
  }
}).export(module)
