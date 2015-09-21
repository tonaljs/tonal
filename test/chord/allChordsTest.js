var vows = require('vows')
var assert = require('assert')
var allChords = require('../../lib/chord/allChords')

vows.describe('chord/allChords').addBatch({
  'chord allChords': function () {
    assert.equal(allChords().length, 229)
    // from chords.json
    assert(allChords().indexOf('Mb5') > 0)
    // from chord-aliases.json
    assert(allChords().indexOf('M7') > 0)
  }
}).export(module)
