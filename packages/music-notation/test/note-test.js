/* global describe it */
var assert = require('assert')
var note = require('../note/note')

describe('music-notation/note', function () {
  it('get notes in scientific notation', function () {
    assert.equal(note('fx'), 'F##')
    assert.equal(note('fx/4'), 'F##')
    assert.equal(note('blah'), null)
    assert.equal(note(), null)
  })
})
