/* global describe it expect */
var _ = require('../')
function up (s) { return s.toUpperCase() }

describe('tonal-array', () => {
  it('asArr', () => {
    expect(_.asArr('a b c')).toEqual([ 'a', 'b', 'c' ])
    expect(_.asArr('a |  b    |  c   ')).toEqual(['a', 'b', 'c'])
    expect(_.asArr('a , b  | c    d')).toEqual(['a', 'b', 'c', 'd'])
  })

  it('map', () => {
    expect(_.map(up, 'a bb cx')).toEqual([ 'A', 'BB', 'CX' ])
    var ups = _.map(up)
    expect(ups('a bb cx')).toEqual([ 'A', 'BB', 'CX' ])
  })

  describe('sort', () => {
    it('sort notes', () => {
      expect(_.sort('c4 c3 c2')).toEqual([ 'C2', 'C3', 'C4' ])
      expect(_.sort('c2 c3 c4', false)).toEqual([ 'C4', 'C3', 'C2' ])
    })
    it('sort pitch classes', () => {
      expect(_.sort('a b c d e f g')).toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
    })
    it('sort intervals', () => {
      expect(_.sort('2m 1P 3m 3M 4A 4P 9m 8P')).toEqual([ '1P', '2m', '3m', '3M', '4P', '4A', '8P', '9m' ])
      expect(_.sort('2m 1P 3m 3M 4A 4P 9m 8P', false)).toEqual([ '9m', '8P', '4A', '4P', '3M', '3m', '2m', '1P' ])
    })
    it('pitch classes are sorted before notes', () => {
      expect(_.sort('c3 d2 d c')).toEqual([ 'C', 'D', 'D2', 'C3' ])
    })
    it('removes anything that is not a pitch', () => {
      expect(_.sort('a2 g3 f h c n x')).toEqual([ 'C', 'F', 'A2', 'G3' ])
      expect(_.sort('a2 g3 f h c n x', false)).toEqual([ 'G3', 'A2', 'F', 'C' ])
    })
    it('not modifies the array', () => {
      var arr = ['c2', 'c1', 'c0']
      expect(_.sort(arr)).toEqual(['C0', 'C1', 'C2'])
      expect(arr).toEqual(['c2', 'c1', 'c0'])
    })
  })

  it('compact', () => {
    expect(_.compact(['a', null, 'b'])).toEqual(['a', 'b'])
    expect(_.compact([0, 1, 2, 3, null, 4])).toEqual([ 0, 1, 2, 3, 4 ])
  })

  it('filter', () => {
    function isUpLetter (s) { return 'CDEFGAB'.indexOf(s[0]) !== -1 }
    expect(_.filter(isUpLetter, 'C d f4 A4 M3')).toEqual([ 'C', 'A4' ])
  })

  it('shuffle', () => {
    var s = _.shuffle('A B C D')
    expect(s.length).toBe(4)
    expect(s.indexOf('A')).not.toBe(-1)
    expect(s.indexOf('B')).not.toBe(-1)
    expect(s.indexOf('C')).not.toBe(-1)
    expect(s.indexOf('D')).not.toBe(-1)
  })

  it('rotate', () => {
    expect(_.rotate(1, 'c d e')).toEqual(['d', 'e', 'c'])
    expect(_.rotate(-1, 'c d e')).toEqual([ 'e', 'c', 'd' ])
    expect(_.rotate(0, 'c d e')).toEqual([ 'c', 'd', 'e' ])
  })

  it('rotateAsc', () => {
    expect(_.rotateAsc(1, 'c d e')).toEqual(['D', 'E', 'C'])
    expect(_.rotateAsc(-1, 'c d e')).toEqual([ 'E', 'C', 'D' ])
    expect(_.rotateAsc(0, 'c d e')).toEqual([ 'C', 'D', 'E' ])
    expect(_.rotateAsc(1, 'c4 d4 e4')).toEqual([ 'D4', 'E4', 'C5' ])
    expect(_.rotateAsc(2, 'c4 d4 e4')).toEqual([ 'E4', 'C5', 'D5' ])
    expect(_.rotateAsc(-1, 'c4 d4 e4')).toEqual([ 'E3', 'C4', 'D4' ])
    expect(_.rotateAsc(-2, 'c4 d4 e4')).toEqual([ 'D3', 'E3', 'C4' ])
    expect(_.rotateAsc(1, 'C1 D3 E5')).toEqual([ 'D3', 'E5', 'C6' ])
    expect(_.rotateAsc(2, 'C1 D3 E5')).toEqual([ 'E5', 'C6', 'D8' ])
    expect(_.rotateAsc(-1, 'C1 D3 E5')).toEqual([ 'E0', 'C1', 'D3' ])
    expect(_.rotateAsc(-2, 'C1 D3 E5')).toEqual([ 'D-2', 'E0', 'C1' ])
  })

  it('select', () => {
    expect(_.select('1 3 5', 'C D E F G A B')).toEqual(['C', 'E', 'G'])
    expect(_.select('1 -3 12 4', 'C D E F G A B')).toEqual([ 'C', null, null, 'F' ])
    expect(_.select('-1 0 1 2 3', 'C D')).toEqual([ null, null, 'C', 'D', null ])
    // partial
    expect(_.select('1 3')('C D E')).toEqual(['C', 'E'])
  })

  it('permutations', () => {
    expect(_.permutations('a b c')).toEqual([
      [ 'a', 'b', 'c' ], [ 'b', 'a', 'c' ], [ 'b', 'c', 'a' ],
      [ 'a', 'c', 'b' ], [ 'c', 'a', 'b' ], [ 'c', 'b', 'a' ]
    ])
  })
})
