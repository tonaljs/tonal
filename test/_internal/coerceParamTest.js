var vows = require('vows')
var assert = require('assert')
var coerce = require('../../lib/_internal/coerceParam')

vows.describe('Interval').addBatch({
  'coerce param': function () {
    var func = coerce('value', function (p) {
      return { value: p }
    })
    assert.equal(func('hello').value, 'hello')
    assert.equal(func(func('hello')).value, 'hello')
    assert.equal(func({ value: 'blah' }).value, 'blah')

    assert.equal(func({ not: 'objects' }), null)
    assert.equal(func(1), null)
  }
}).export(module)
