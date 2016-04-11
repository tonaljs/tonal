/* global describe it */
var assert = require('assert')
var scales = require('..')

describe('scale-dictionary', function () {
  it('get scale intervals', function () {
    assert.deepEqual(scales['major'], [ '1', '2', '3', '4', '5', '6', '7' ])
    assert.deepEqual(scales['dorian'], [ '1', '2', '3b', '4', '5', '6', '7b' ])
    assert.deepEqual(scales['bebop'], [ '1', '2', '3', '4', '5', '6', '7b', '7' ])
  })
  it('get name of alias', function () {
    assert.equal(scales['ionian'], 'major')
    assert.equal(scales['arabian'], 'locrian major')
  })
  it('has scales', function () {
    assert(Object.keys(scales).length > 100)
  })
  it('every name has value', function () {
    Object.keys(scales).forEach(function (name) {
      assert(scales[name])
    })
  })
})
