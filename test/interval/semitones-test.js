var vows = require('vows')
var assert = require('assert')
var semitones = require('../../lib/interval/semitones')

vows.describe('Interval').addBatch({
  'pitch semitones': function () {
    assert.equal(semitones('P5'), 7)
    assert.equal(semitones('P-5'), -7)
    assert.equal(semitones('P4'), 5)
  }
}).export(module)
