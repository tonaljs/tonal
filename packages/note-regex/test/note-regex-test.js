/* global describe it */
var assert = require('assert')
var R = require('..')
function exec (n) { return R.exec(n).slice(0, 6) }

describe('note-regex', function () {
  it('parses pitch classes', function () {
    assert.deepEqual(exec('C'), ['C', 'C', '', '', '', ''])
    assert.deepEqual(exec('a'), ['a', 'a', '', '', '', ''])
  })

  it('parses accidentals', function () {
    assert.deepEqual(exec('c#####'), ['c#####', 'c', '#####', '', '', ''])
    assert.deepEqual(exec('bbbbbb'), ['bbbbbb', 'b', 'bbbbb', '', '', ''])
    assert.deepEqual(exec('fxxx'), [ 'fxxx', 'f', 'xxx', '', '', '' ])
  })

  it('parses duration', function () {
    assert.deepEqual(exec('gb3/4'), [ 'gb3/4', 'g', 'b', '3', '/4', '' ])
  })

  it('parses elements', function () {
    assert.deepEqual(exec('C#2 dorian'), [ 'C#2 dorian', 'C', '#', '2', '', 'dorian' ])
    assert.deepEqual(exec('BbMaj7'), [ 'BbMaj7', 'B', 'b', '', '', 'Maj7' ])
  })
})
