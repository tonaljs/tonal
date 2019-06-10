import { distance, substract } from '../src/tonal'
import { IntervalName } from '../src/interval'

const lift = (fn: (str: string) => string | undefined) => (list: string) =>
  list
    .split(' ')
    .map(fn)
    .join(' ')

const intervalFrom = (i: IntervalName) => lift(to => distance(i, to))

describe('distance', () => {
  describe('find intervals between notes', () => {
    test('interval between notes', () => {
      const fromC3 = lift(intervalFrom('C3'))
      expect(fromC3('C3 e3 e4 c2 e2')).toEqual('1P 3M 10M -8P -6m')
    })

    test('intervals between pitch classes are always ascending', () => {
      expect(distance('C', 'D')).toEqual('2M')

      const fromC = lift(intervalFrom('C'))
      expect(fromC('c d e f g a b')).toEqual('1P 2M 3M 4P 5P 6M 7M')

      const fromG = lift(intervalFrom('G'))
      expect(fromG('c d e f g a b')).toEqual('4P 5P 6M 7m 1P 2M 3M')
    })

    test('note types can not be mixed', () => {
      expect(distance('C', 'C2')).toBe(undefined)
      expect(distance('C2', 'C')).toBe(undefined)
    })

    test('notes must be valid', () => {
      expect(distance('one', 'two')).toBe(undefined)
    })
  })
  describe('substract intervals', () => {
    test('subtract intervals', () => {
      expect(substract('5P', '3M')).toEqual('3m')
      expect(substract('3M', '5P')).toEqual('-3m')
    })
  })
})
