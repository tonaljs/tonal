var vows = require('vows')
var assert = require('assert')
var strict = require('../../lib/utils/strict')
var strictParse = strict('Note not valid.', require('../../lib/note/parse'))

vows.describe('Interval').addBatch({
  'strict parse note': function () {
    assert.equal(strictParse('C2').name, 'C2')
    assert.throws(function () { strictParse('P1') }, /Note not valid/)
  }
}).export(module)
