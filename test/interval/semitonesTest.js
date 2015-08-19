var vows = require('vows')
var assert = require('assert')
var semitones = require('../../lib/interval/semitones')

vows.describe('Interval').addBatch({
  'pitch semitones': function () {
    assert.equal(semitones('P5'), 7)
    assert.equal(semitones('P-5'), -7)
    assert.equal(semitones('P4'), 5)
  },
  'simple interval semitones': function () {
    assert.deepEqual(['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(semitones),
      [0, 2, 4, 5, 7, 9, 11])
    assert.deepEqual(['d1', 'm2', 'm3', 'd4', 'd5', 'm6', 'm7'].map(semitones),
      [-1, 1, 3, 4, 6, 8, 10])
    assert.deepEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'].map(semitones),
      [1, 3, 5, 6, 8, 10, 12])
  },
  'simple descendent semitones': function () {
    assert.deepEqual(['P-1', 'M-2', 'M-3', 'P-4', 'P-5', 'M-6', 'M-7'].map(semitones),
      [0, -2, -4, -5, -7, -9, -11])
    assert.deepEqual(['d-1', 'm-2', 'm-3', 'd-4', 'd-5', 'm-6', 'm-7'].map(semitones),
      [1, -1, -3, -4, -6, -8, -10])
  },
  'compound semitones': function () {
    assert.deepEqual(['P8', 'M9', 'M10', 'P11', 'P12', 'M13', 'M14'].map(semitones),
      [12, 14, 16, 17, 19, 21, 23])
    assert.deepEqual(['P-8', 'M-9', 'M-10', 'P-11', 'P-12', 'M-13', 'M-14'].map(semitones),
      [-12, -14, -16, -17, -19, -21, -23])
  }
}).export(module)
