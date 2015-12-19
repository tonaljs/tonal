/* global describe it */
var assert = require('assert')
var build = require('..').build

describe('chord.build', function () {
  it('build from notes and tonic', function () {
    assert.deepEqual(build('C2 E2 G2', 'A4'), ['A4', 'C#5', 'E5'])
  })
})
