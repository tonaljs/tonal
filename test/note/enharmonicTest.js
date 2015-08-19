var vows = require('vows')
var assert = require('assert')
var enharmonic = require('../../lib/note/enharmonic')

vows.describe('Note').addBatch({
  'pitch enharmonic': function () {
    assert.equal(enharmonic('C4', 'D'), 'Dbb4')
    assert.equal(enharmonic('Db3', 'C'), 'C#3')
    assert.equal(enharmonic('B2', 'C'), 'Cb3')
    assert.equal(enharmonic('C3', 'B'), 'B#2')
  }
}).export(module)
