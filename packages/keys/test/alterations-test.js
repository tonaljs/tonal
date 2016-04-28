/* global describe it */
var assert = require('assert')
var key = require('..')

describe('keys', function () {
  describe('alteration', function () {
    it('major', function () {
      assert.deepEqual(key.alteration('C major'), 0)
      assert.deepEqual(key.alteration('F major'), -1)
      assert.deepEqual(key.alteration('A major'), 3)
      assert.deepEqual(key.alteration('Eb major'), -3)
    })
    it.skip('modes', function () {
      assert.deepEqual(key.alteration('A minor'), 0)
      assert.deepEqual(key.alteration('C dorian'), -2)
    })
    it('invalid', function () {
      assert.equal(key.alteration('minor'), null)
      assert.equal(key.alteration('C blah'), null)
    })
  })
})
