/* global describe it */
var assert = require('assert')
var roman = require('..').roman

function fifths (str) {
  return str.split(' ').map(roman.parse).map(function (e) { return e[0] })
}

describe('roman numerals to coord', function () {
  it('plain roman numerals', function () {
    assert.deepEqual(fifths('I II III IV V VI VII'), [0, 2, 4, -1, 1, 3, 5])
    assert.deepEqual(fifths('I II III IV V VI VII'), fifths('i ii iii iv v vi vii'))
  })
  it('altered roman numerals', function () {
    assert.deepEqual(fifths('bI bII bIII bIV bV bVI bVII'),
      fifths('i ii iii iv v vi vii').map(function (e) { return e - 7 }))
    assert.deepEqual(fifths('#I #II #III #IV #V #VI #VII'),
      fifths('i ii iii iv v vi vii').map(function (e) { return e + 7 }))
  })
  it('invalid', function () {
    assert.equal(roman.parse(), null)
    assert.equal(roman.parse('VImaj7'), null)
    assert.equal(roman.parse('blah'), null)
  })
})
