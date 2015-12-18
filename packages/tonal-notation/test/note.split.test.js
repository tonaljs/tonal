/* global describe it */
var assert = require('assert')
var split = require('..').note.split

function eq (regex, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (regex[i] !== arr[i]) {
      console.log('fail', regex, arr, i)
      return false
    }
  }
  return true
}

describe('note split', function () {
  it('pitch classes', function () {
    assert(eq(split('C'), ['C', 'C']))
    assert(eq(split('fx'), ['fx', 'f', 'x']))
  })
  it('notes without duration', function () {
    assert(eq(split('cbb4'), ['cbb4', 'c', 'bb', '4']))
  })
  it('notes with duration', function () {
    assert(eq(split('cbb4/3'), ['cbb4/3', 'c', 'bb', '4', '/3']))
  })
  it('chords', function () {
    assert(eq(split('CbMaj7'), ['CbMaj7', 'C', 'b', '', '', 'Maj7']))
  })
  it('scales', function () {
    assert(eq(split('Cbmajor'), ['Cbmajor', 'C', 'b', '', '', 'major']))
    assert(eq(split('Cb major'), ['Cb major', 'C', 'b', '', '', 'major']))
  })
})
