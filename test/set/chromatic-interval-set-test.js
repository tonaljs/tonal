var vows = require('vows')
var assert = require('assert')
var chromatic = require('../../lib/set/chromatic-interval-set')

vows.describe('Set').addBatch({
  'empty set': function () {
    assert.deepEqual(chromatic(0), [])
  },
  'one octave chromatic interval set': function () {
    assert.deepEqual(chromatic(1), ['P1'])
    assert.deepEqual(chromatic(12), ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7'])
  },
  'two octaves chromatic set': function () {
    assert.deepEqual(chromatic(13), ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'])
    assert.deepEqual(chromatic(24), [
      'P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7',
      'P8', 'm9', 'M9', 'm10', 'M10', 'P11', 'd12', 'P12', 'm13', 'M13', 'm14', 'M14'])
  }
}).export(module)
