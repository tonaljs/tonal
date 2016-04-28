/* global describe it */
var assert = require('assert')
var key = require('..')

describe('music-key/signature', function () {
  it.skip('get major signatures', function () {
    assert.deepEqual(key.signature('F major'), 'b')
    assert.deepEqual(key.signature('A major'), '###')
    assert.deepEqual(key.signature('Eb major'), 'bbb')
  })
  it.skip('returns null if not valid key', function () {
    assert.equal(key.signature('c Blah'), null)
    assert.equal(key.signature('minor'), null)
  })
})
