var vows = require('vows')
var assert = require('assert')
var unstrict = require('../../lib/utils/unstrict')

vows.describe('util/unstrict').addBatch({
  'strict parse note': function () {
    var func = unstrict(function (num) {
      if (num === 0) throw Error('Not valid')
      return num
    })
    assert.equal(func(0), null)
    assert.equal(func(2), 2)
  }
}).export(module)
