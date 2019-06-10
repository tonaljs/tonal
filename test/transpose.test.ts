import { transpose, transposeFifths, add } from '../src/tonal'
import { NoteName } from '../src/note'
import { IntervalName } from '../src/interval'

const lift = (fn: (str: string) => string | undefined) => (list: string) =>
  list
    .split(' ')
    .map(fn)
    .join(' ')

export function transposeFrom(note: NoteName) {
  return lift(interval => transpose(note, interval))
}
export function transposeBy(interval: IntervalName) {
  return lift(note => transpose(note, interval))
}

describe('Transpose', () => {
  describe('transpose notes', () => {
    test('transpose pitch classes by intervals', () => {
      const trFromBb = transposeFrom('Bb')
      expect(trFromBb('P1 M3 P5 M7')).toEqual('Bb D F A')
    })

    test('transpose notes by intervals', () => {
      const trFromBb2 = transposeFrom('Bb2')
      expect(trFromBb2('P1 M3 P5 M7')).toEqual('Bb2 D3 F3 A3')
    })

    test('tranpose note by descending intervas', () => {
      const trFromBb = transposeFrom('Bb')
      expect(trFromBb('P-1 M-3 P-5 M-7')).toEqual('Bb Gb Eb Cb')
    })

    test('transpose by interval', () => {
      const trBy3M = transposeBy('3M')
      expect(trBy3M('c2 d3 f4 g5')).toEqual('E2 F#3 A4 B5')
    })

    test('invalid notes and intervals', () => {
      expect(transpose('M3', 'blah')).toBe(undefined)
      expect(transpose('blah', 'C2')).toBe(undefined)
      expect(transpose('', '')).toBe(undefined)
    })

    test('transpose by descending intervals', () => {
      const trDescM2 = transposeBy('-2M')
      expect(trDescM2('c2 d3 f4 g5')).toEqual('Bb1 C3 Eb4 F5')
    })

    test('transpose edge cases', () => {
      const fromC2 = transposeFrom('C2')

      expect(fromC2('1d 1P 1A')).toEqual('Cb2 C2 C#2')
      expect(fromC2('-1d -1P -1A')).toEqual('C#2 C2 Cb2')
      expect(fromC2('2d 2m 2M 2A')).toEqual('Dbb2 Db2 D2 D#2')
      expect(fromC2('-2d -2m -2M -2A')).toEqual('B#1 B1 Bb1 Bbb1')
      expect(fromC2('4dd 4d 4P 4A 4AA')).toEqual('Fbb2 Fb2 F2 F#2 F##2')
      expect(fromC2('5P -5P 5A -5A')).toEqual('G2 F1 G#2 Fb1')
      expect(fromC2('6M -6M 6m -6m')).toEqual('A2 Eb1 Ab2 E1')
    })
  })

  describe('transpose intervals', () => {
    test('add ascending intervals ', () => {
      const add3M = lift(i => add('3M', i))
      expect(add3M('1P 2M 3M 4P 5P')).toEqual('3M 4A 5A 6M 7M')
    })

    test('add descending intervals', () => {
      const addDescM2 = lift(i => add('-2M', i))
      expect(addDescM2('1P 2M 3M 4P 5P')).toEqual('-2M 1P 2M 3m 4P')
      expect(addDescM2('-5P -4P -3M -2M 1P')).toEqual('-6M -5P -4A -3M -2M')
    })
  })

  describe('transpose fifths', () => {
    test('transpose fifths', () => {
      const FIFTHS = [0, 1, 2, 3, 4, 5, 6, 7]
      expect(FIFTHS.map(f => transposeFifths('C', f)).join(' ')).toEqual(
        'C G D A E B F# C#'
      )
      expect(FIFTHS.map(f => transposeFifths('C4', f)).join(' ')).toEqual(
        'C G D A E B F# C#'
      )
    })

    test('invalid note', () => {
      expect(transposeFifths('one', 3)).toEqual(undefined)
    })
  })
})
