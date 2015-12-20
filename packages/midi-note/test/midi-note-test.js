/* global describe it */
var assert = require('assert')
var note = require('..')

describe('midi-note', function () {
  it('basic', function () {
    assert.equal(note(0), 'C-1')
    assert.equal(note(69), 'A4')
    assert.equal(note(127), 'G9')
  })
  it('octaves', function () {
    var nums
    nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    assert.equal(nums.map(note).join(' '), 'C-1 Db-1 D-1 Eb-1 E-1 F-1 Gb-1 G-1 Ab-1 A-1 Bb-1 B-1')
    nums = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    assert.equal(nums.map(note).join(' '), 'C0 Db0 D0 Eb0 E0 F0 Gb0 G0 Ab0 A0 Bb0')
    nums = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
    assert.equal(nums.map(note).join(' '), 'C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4 Bb4 B4')
  })
  it('invalid numbers', function () {
    assert.equal(note(-1), null)
    assert.equal(note(128), null)
    assert.equal(note('D'), null)
  })
})
