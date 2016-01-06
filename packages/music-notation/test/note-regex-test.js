/* global describe it */
var assert = require('assert')
var R = require('../note/regex')
function exec (n) { return R.exec(n).slice(0, 6) }

describe('music-notation/note-regex', function () {
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

  it('chords', function () {
    assert.deepEqual(exec('CbMaj7'), ['CbMaj7', 'C', 'b', '', '', 'Maj7'])
  })
  it('scales', function () {
    assert.deepEqual(exec('Cbmajor'), ['Cbmajor', 'C', 'b', '', '', 'major'])
    assert.deepEqual(exec('Cb major'), ['Cb major', 'C', 'b', '', '', 'major'])
  })
})
