/* global describe test expect */
var n = require('..')

describe('tonal-notation', () => {
  test('letter to step', () => {
    expect('ABCDEFGHIJKLMNO'.split('').map(n.toStep))
    .toEqual([ 5, 6, 0, 1, 2, 3, 4, null, null, null, null, null, null, null, null ])
    expect('abcdefghijklmno'.split('').map(n.toStep))
    .toEqual([ 5, 6, 0, 1, 2, 3, 4, null, null, null, null, null, null, null, null ])
    expect('123456789'.split('').map(n.toStep))
    .toEqual([ null, null, null, null, null, null, null, null, null ])
  })

  test('step to letter', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n.toLetter))
    .toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B', null, null, null, null ])
  })

  test('toAlt', () => {
    expect([ 'bbbb', 'bbb', 'bb', 'b', '', '#', '##', '###', '####' ].map(n.toAlt))
    .toEqual([ -4, -3, -2, -1, 0, 1, 2, 3, 4 ])
  })

  test('toAcc', () => {
    expect(n.toAcc()).toEqual('')
    expect([-4, -3, -2, -1, 0, 1, 2, 3, 4].map(n.toAcc))
    .toEqual([ 'bbbb', 'bbb', 'bb', 'b', '', '#', '##', '###', '####' ])
  })
})
