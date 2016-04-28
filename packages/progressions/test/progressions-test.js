/* global describe it */

var assert = require('assert')
var progressions = require('..')
var regex = progressions.romanRegex()
function exec (str) { return regex.exec(str).slice(0, 4) }

describe('chord-progression', function () {
  describe('progression', function () {
    var prog = progressions.progression
    it('creates a chord progression from roman numerals chords and tonic', function () {
      assert.deepEqual(prog('I IIm7 V7', 'C'), ['C', 'Dm7', 'G7'])
    })

    it('skips invalid roman numerals', function () {
      assert.deepEqual(prog('Imaj7 2 IIIm7', 'C'), [ 'Cmaj7', null, 'Em7' ])
    })
  })
  describe('parseRoman', function () {
  })
  describe('romanRegex', function () {
    var nums = 'I II III IV V VI VII'.split(' ')
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
    it('split chords', function () {
      assert.deepEqual(exec('bVImaj7'), ['bVImaj7', 'b', 'VI', 'maj7'])
      assert.deepEqual(exec('III dom'), ['III dom', '', 'III', 'dom'])
    })
  })
})
