/* global describe it */
var assert = require('assert')
var regex = require('../roman/regex')

function exec (str) { return regex.exec(str).slice(0, 4) }

var nums = 'I II III IV V VI VII'.split(' ')
describe('array-notation/roman/regex', function () {
  it('case independent', function () {
    nums.forEach(function (n) {
      assert.deepEqual(exec(n), [n, '', n, ''])
      var l = n.toLowerCase()
      assert.deepEqual(exec(l), [l, '', l, ''])
    })
  })

  it('can have alterations', function () {
    nums.forEach(function (n) {
      '# ## b bb'.split(' ').forEach(function (alt) {
        assert.deepEqual(exec(alt + n), [alt + n, alt, n, ''])
      })
    })
  })
  it('chords', function () {
    assert.deepEqual(exec('bVImaj7'), ['bVImaj7', 'b', 'VI', 'maj7'])
    assert.deepEqual(exec('III dom'), ['III dom', '', 'III', 'dom'])
  })
})
