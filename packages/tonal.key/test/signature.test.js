/* global describe it */
var assert = require('assert')
var key = require('..')

describe('key.signature', function () {
  it('major', function () {
    assert.deepEqual(key.signature('F major'), 'b')
    assert.deepEqual(key.signature('A major'), '###')
    assert.deepEqual(key.signature('Eb major'), 'bbb')
  })
  it('invalid', function () {
    assert.equal(key.signature('c Blah'), null)
    assert.equal(key.signature('minor'), null)
  })
})
