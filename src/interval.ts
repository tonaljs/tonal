import { toFifthsOctaves, FifthsOctaves, PitchProps } from './pitch'
export type IntervalName = string

type Quality =
  | 'dddd'
  | 'ddd'
  | 'dd'
  | 'd'
  | 'm'
  | 'M'
  | 'P'
  | 'A'
  | 'AA'
  | 'AAA'
  | 'AAAA'
type Type = 'perfectable' | 'majorable'

interface IntervalValidProps {
  name: IntervalName
  num: number
  q: Quality
  type: Type
  step: number
  alt: number
  dir: number
  simple: number
  semitones: number
  chroma: number
  fo: FifthsOctaves
  oct: number
}

interface IntervalInvalidProps {
  name: undefined
  num: undefined
  q: undefined
  type: undefined
  step: undefined
  alt: undefined
  dir: undefined
  simple: undefined
  semitones: undefined
  chroma: undefined
  fo: undefined
  oct: undefined
}

export type IntervalProps = IntervalValidProps | IntervalInvalidProps

const InvalidInterval = {} as IntervalInvalidProps

// shorthand tonal notation (with quality after number)
const IVL_TNL = '([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
const IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?\\d+)'
const REGEX = new RegExp('^' + IVL_TNL + '|' + IVL_STR + '$')

export function tokenize(str?: IntervalName) {
  const m = REGEX.exec(`${str}`)
  if (m === null) return undefined
  return m[1] ? [m[1], m[2]] : [m[4], m[3]]
}

const CACHE: { [key in string]: IntervalProps } = { undefined: InvalidInterval }

/**
 * Get interval properties. It returns an object with:
 *
 * - name: the interval name
 * - num: the interval number
 * - type: 'perfectable' or 'majorable'
 * - q: the interval quality (d, m, M, A)
 * - dir: interval direction (1 ascending, -1 descending)
 * - simple: the simplified number
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 *
 * @param {string} interval - the interval name
 * @return {Object} the interval in the form [number, alt]
 *
 * @example
 * import { interval } from '@tonaljs/tonal'
 * interval('P5').semitones // => 7
 * interval('m3').type // => 'majorable'
 */
export function interval(ivl: IntervalName | PitchProps): IntervalProps {
  if (typeof ivl === 'string') {
    if (CACHE[ivl]) return CACHE[ivl]
    CACHE[ivl] = properties(ivl)
    return CACHE[ivl]
  } else {
    return fromPitchProps(ivl)
  }
}

const SIZES = [0, 2, 4, 5, 7, 9, 11]
const TYPES = 'PMMPPMM'
function properties(str?: string): IntervalProps {
  const tokens = tokenize(str)
  if (tokens === undefined) return InvalidInterval
  const num = +tokens[0]
  const q = tokens[1] as Quality
  const step = (Math.abs(num) - 1) % 7
  const t = TYPES[step]
  if (t === 'M' && q === 'P') return InvalidInterval
  const type = t === 'M' ? 'majorable' : 'perfectable'

  const name = '' + num + q
  const dir = num < 0 ? -1 : 1
  const simple = num === 8 || num === -8 ? num : dir * (step + 1)
  const alt = qToAlt(type, q) as number
  const oct = Math.floor((Math.abs(num) - 1) / 7)
  const semitones = dir * (SIZES[step] + alt + 12 * oct)
  const chroma = (((dir * (SIZES[step] + alt)) % 12) + 12) % 12
  const fo = toFifthsOctaves({ step, alt, oct, dir }) as FifthsOctaves
  return {
    name,
    num,
    q,
    step,
    alt,
    dir,
    type,
    simple,
    semitones,
    chroma,
    fo,
    oct
  }
}

function qToAlt(type: Type, q: string) {
  if (q === 'M' && type === 'majorable') return 0
  if (q === 'P' && type === 'perfectable') return 0
  if (q === 'm' && type === 'majorable') return -1
  if (/^A+$/.test(q)) return q.length
  if (/^d+$/.test(q))
    return -1 * (type === 'perfectable' ? q.length : q.length + 1)
}

function fromPitchProps(props: PitchProps): IntervalProps {
  const { step, alt, oct = 0, dir } = props
  if (!dir) return InvalidInterval
  const num = step + 1 + 7 * oct
  const d = dir < 0 ? '-' : ''
  const type = TYPES[step] === 'M' ? 'majorable' : 'perfectable'
  const name = d + num + altToQ(type, alt)
  return interval(name)
}

const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s)

function altToQ(type: Type, alt: number) {
  if (alt === 0) return type === 'majorable' ? 'M' : 'P'
  if (alt === -1 && type === 'majorable') return 'm'
  if (alt > 0) return fillStr('A', alt)
  if (alt < 0) return fillStr('d', type === 'perfectable' ? alt : alt + 1)
}
