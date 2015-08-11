var vows = require('vows')
var assert = require('assert')
var key = require('../lib/key-signature.js')

vows.describe('midi').addBatch({
  'signature by number': function () {
    assert.deepEqual(key(0), { num: 0, alt: '', major: 'C', minor: 'A' })
    assert.deepEqual(key(1), { num: 1, alt: '#', major: 'G', minor: 'E' })
    assert.deepEqual(key(-1), { num: -1, alt: 'b', major: 'F', minor: 'D' })
  },
  'signature by alterations': function () {
    assert.equal(key('').num, 0)
    assert.equal(key('#').num, 1)
    assert.equal(key('##').num, 2)
    assert.equal(key('b').num, -1)
    assert.equal(key('bb').num, -2)
  },
  'signature by major tonic': function () {
    assert.equal(key('C').num, 0)
    assert.equal(key('G').num, 1)
    assert.equal(key('F').num, -1)
  }
}).export(module)
