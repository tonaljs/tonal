/* global describe it */
var assert = require('assert')
var filter = require('..')

describe('note-filter', function () {
  it('accepts function as filter', function () {
    var cs = filter(function (p) { return p[0] === 0 })
    assert.deepEqual(cs('c d e C2 d2 e2'), ['C', 'C2'])
  })
  it('filter notes by one pitch class', function () {
    assert.deepEqual(filter('c', 'c3 c#2 c2 c4 cb2'), ['C3', 'C2', 'C4'])
  })
  it('filter notes by one note name', function () {
    assert.deepEqual(filter('c2', 'c3 c#2 c2 c4 cb2'), ['C2'])
  })
  it('filter pitch classes', function () {
    var f = filter('c d e')
    assert.deepEqual(f('c c# d d# e e#'), [ 'C', 'D', 'E' ])
  })
  it('filter notes by a pitch class list', function () {
    var f = filter('C G')
    assert.deepEqual(f('c2 db2 d2 eb2 gb2 g3 ab g4'), [ 'C2', 'G3', 'G4' ])
  })
  it('filter midi notes', function () {
    var f1 = filter.midi('C D F')
    var f2 = filter.midi('C D E#')
    var oct = '60 61 62 63 64 65 66 67 68 69 70 71 72'
    assert.deepEqual(f1(oct), [ 'C4', 'D4', 'F4', 'C5' ])
    assert.deepEqual(f2(oct), [ 'C4', 'D4', 'E#4', 'C5' ])
  })
  it('filter midi scale', function () {
    var cMinor = filter.midi('c d eb f g ab bb')
    var oct = '60 61 62 63 64 65 66 67 68 69 70 71 72'
    assert.deepEqual(cMinor(oct), [ 'C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5' ])
  })
})
