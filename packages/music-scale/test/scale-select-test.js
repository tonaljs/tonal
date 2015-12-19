/* global describe it */
var assert = require('assert')
var select = require('../lib/select')

describe('music-scale/select', function () {
  it('get specified only', function () {
    assert.deepEqual(select('1 3 5', 'C D E F G A B'), [ 'C', 'E', 'G' ])
    assert.deepEqual(select('1 3 6', 'C D E F G B'), [ 'C', 'E', null ])
  })
  it('different order', function () {
    assert.deepEqual(select('1 5 3', 'C D E F G A B'), [ 'C', 'G', 'E' ])
    assert.deepEqual(select('1 5 2 6', 'C D E F G A B'), [ 'C', 'G', 'D', 'A' ])
  })
  it('higher than an octave', function () {
    assert.deepEqual(select('1 2 3', 'C2 D4 E5'), ['C2', 'D2', 'E2'])
    assert.deepEqual(select('1 2 8 9', 'C2 D4 E5'), ['C2', 'D2', 'C3', 'D3'])
    assert.deepEqual(select('1 8 15', 'C2 D4 E5'), ['C2', 'C3', 'C4'])
  })
  it('partially applied', function () {
    var pattern = select('1 3 5 8 5 3 1')
    assert.deepEqual(pattern('c2 d e f g a b'), ['C2', 'E2', 'G2', 'C3', 'G2', 'E2', 'C2'])
  })
  it('work with pitch-array format', function () {
    assert.deepEqual(select('1 3 5 8', [ [0, 0, 4], [1, 0, 4] ]),
      [ [0, 0, 4], null, [1, 0, 4], [0, 1, 4] ])
  })
})
