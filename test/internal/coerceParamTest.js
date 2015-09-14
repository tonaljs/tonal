var vows = require('vows')
var assert = require('assert')
var coerce = require('../../lib/internal/coerceParam')

vows.describe('Interval').addBatch({
  'coerce param': function () {
    var func = coerce('value', function (p) {
      return { value: p }
    })
    assert.equal(func('hello').value, 'hello')
    assert.equal(func(func('hello')).value, 'hello')
    assert.equal(func({ value: 'blah' }).value, 'blah')

    assert.throws(function () { func([]) }, 'only strings')
    assert.throws(function () { func(1) }, 'only strings')
  }
}).export(module)
