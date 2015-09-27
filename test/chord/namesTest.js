var vows = require('vows')
var assert = require('assert')
var names = require('../../lib/chord/names')

vows.describe('chord/names').addBatch({
  'all chord names': function () {
    assert.equal(names().length, 229)
    // from chords.json
    assert(names().indexOf('Mb5') > 0)
    // from chord-aliases.json
    assert(names().indexOf('M7') > 0)
  }
}).export(module)
