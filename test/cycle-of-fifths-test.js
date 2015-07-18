var vows = require('vows')
var assert = require('assert')
var cycle = require('../cycle-of-fifths')

vows.describe('Cycle of fifths').addBatch({
  'positive notes': function () {
    var nums = '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16'.split(' ')
    var notes = nums.map(function (num) {
      return cycle(+num)
    })
    assert.equal(notes.join(' '), 'C G D A E B F# C# G# D# A# F C G D A E')
  },
  'negative notes': function () {
    var nums = '0 -1 -2 -3 -4 -5 -6 -7 -8 -9 -10 -11 -12 -13 -14 -15 -16'.split(' ')
    var notes = nums.map(function (num) {
      return cycle(+num)
    })
    assert.equal(notes.join(' '), 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb C F Bb Eb Ab')
  },
  'size 0 is empty': function () {
    assert.deepEqual(cycle(0, 0), [])
  },
  'ascendent': function () {
    assert.equal(cycle(0, 4).join(' '), 'C G D A')
    assert.equal(cycle(2, 4).join(' '), 'D A E B')
    assert.equal(cycle(0, 12).join(' '), 'C G D A E B F# C# G# D# A# F')
    assert.equal(cycle(0, 14).join(' '), 'C G D A E B F# C# G# D# A# F C G')
    assert.equal(cycle(-1, 7).join(' '), 'F C G D A E B')
    assert.equal(cycle(7, 4).join(' '), 'C# G# D# A#')
  },
  'descendent': function () {
    assert.equal(cycle(0, 4, true).join(' '), 'C F Bb Eb')
    assert.equal(cycle(2, 4, true).join(' '), 'Bb Eb Ab Db')
    assert.equal(cycle(0, 12, true).join(' '), 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb')
    assert.equal(cycle(0, 14, true).join(' '), 'C F Bb Eb Ab Db Gb Cb Fb Bbb Ebb Abb C F')
    assert.equal(cycle(-1, 7, true).join(' '), 'Abb C F Bb Eb Ab Db')
    assert.equal(cycle(-5, 2, true).join(' '), 'Cb Fb')
  },
  'index of': function () {
    assert.equal(cycle.indexOf('C'), 0)
    assert.equal(cycle.indexOf('C#'), 7)
    assert.equal(cycle.indexOf('Bb'), -2)
  }
}).export(module)
