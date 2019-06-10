import { tokenize, note } from '../src/tonal'

const lift = (fn: (str: string) => string | undefined) => (list: string) =>
  list
    .split(' ')
    .map(fn)
    .join(' ')

describe('note', () => {
  test('tokenize', () => {
    expect(tokenize('Cbb5 major')).toEqual(['C', 'bb', '5', 'major'])
    expect(tokenize('Ax')).toEqual(['A', '##', '', ''])
    expect(tokenize('CM')).toEqual(['C', '', '', 'M'])
    expect(tokenize('maj7')).toEqual(['', '', '', 'maj7'])
    expect(tokenize('')).toEqual(['', '', '', ''])
    expect(tokenize('bb')).toEqual(['B', 'b', '', ''])
    expect(tokenize('##')).toEqual(['', '##', '', ''])
  })

  describe('note properties from string', () => {
    test('height', () => {
      const height = lift(n => '' + note(n).height)
      expect(height('C4 D4 E4 F4 G4')).toEqual('60 62 64 65 67')
      expect(height('B-2 C-1 D-1')).toEqual('-1 0 2')
      expect(height('F9 G9 A9')).toEqual('125 127 129')
      expect(height('C-4 D-4 E-4 F-4 G-4')).toEqual('-36 -34 -32 -31 -29')
      expect(height('C D E F G')).toEqual('-1188 -1186 -1184 -1183 -1181')
    })
    test('midi', () => {
      const midi = lift(n => '' + note(n).midi)
      expect(midi('C4 D4 E4 F4 G4')).toEqual('60 62 64 65 67')
      expect(midi('B-2 C-1 D-1')).toEqual('undefined 0 2')
      expect(midi('F9 G9 A9')).toEqual('125 127 undefined')
      expect(midi('C-4 D-4 E-4 F-4')).toEqual(
        'undefined undefined undefined undefined'
      )
      expect(midi('C D E F')).toEqual('undefined undefined undefined undefined')
    })
    test('freq', () => {
      const freq = (n: string) => note(n).freq
      expect(freq('C4')).toEqual(261.6255653005986)
      expect(freq('B-2')).toEqual(7.716926582126941)
      expect(freq('F9')).toEqual(11175.303405856126)
      expect(freq('C-4')).toEqual(1.0219748644554634)
      expect(freq('C')).toEqual(undefined)
    })
  })

  test('note properties from pitch properties', () => {
    expect(note({ step: 1, alt: -1 }).name).toBe('Db')
    expect(note({ step: 2, alt: 1 }).name).toBe('E#')
    expect(note({ step: 2, alt: 1, oct: 4 }).name).toBe('E#4')
    expect(note({ step: 5, alt: 0 }).name).toBe('A')
    expect(note({ step: -1, alt: 0 }).name).toBe(undefined)
    expect(note({ step: 8, alt: 0 }).name).toBe(undefined)
  })
})
