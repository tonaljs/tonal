/* global describe it */
var assert = require('assert')
var notation = require('..')

function parse (a) { return isNaN(a) ? null : +a + 10 }
function str (a) { return isNaN(a) ? null : a * 10 }
var operation = notation(parse, str)

describe('array-notation/operation', function () {
  it('one parameter', function () {
    var op = operation(function (a) {
      return a + a
    })
    assert.equal(op(1), 220)
    assert.equal(op('a'), 'aa')
  })
  it('two parameters', function () {
    var op = operation(function (a, b) {
      return a + b
    })
    assert.equal(op(10, 6), '360')
    assert.equal(op('a', 'b'), 'ab')
    assert.equal(op(10, 'b'), '20b')
  })
  it('curry', function () {
    var op = notation(parse, str, function (a, b) {
      return a + b
    })
    assert.equal(op(10)(6), '360')
  })
})
