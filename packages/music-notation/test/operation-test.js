/* global describe it */
var assert = require('assert')
var operation = require('../operation')

function parse (a) { return isNaN(a) ? null : +a + 10 }
function str (a) { return isNaN(a) ? null : a * 10 }
var notation = operation(parse, str)

describe('music-notation/operation', function () {
  it('one parameter', function () {
    var op = notation(function (a) {
      return a + a
    })
    assert.equal(op(1), 220)
    assert.equal(op('a'), 'aa')
  })
  it('two parameters', function () {
    var op = notation(function (a, b) {
      return a + b
    })
    assert.equal(op(10, 6), '360')
    assert.equal(op('a', 'b'), 'ab')
    assert.equal(op(10, 'b'), '20b')
  })
  it('curry', function () {
    var op = operation(parse, str, function (a, b) {
      return a + b
    })
    assert.equal(op(10)(6), '360')
  })
})
