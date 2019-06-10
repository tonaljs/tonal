import { Fifths, FifthsOctaves, PitchProps, toFifthsOctaves } from './pitch'

export type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
export type Accidentals = string
export type NoteWithOctave = string
export type PitchClass = string
export type NoteName = NoteWithOctave | PitchClass

export interface NoteValidProps extends PitchProps {
  name: NoteName
  letter: NoteLetter
  acc: Accidentals
  pc: PitchClass
  chroma: number
  height: number
  fo: Fifths | FifthsOctaves
  midi: number | undefined
  freq: number | undefined
}

export type NoteInvalidProps = {
  name: undefined
  letter: undefined
  acc: undefined
  pc: undefined
  step: undefined
  alt: undefined
  chroma: undefined
  height: undefined
  oct: undefined
  fo: undefined
  midi: undefined
  freq: undefined
}

export type NoteProps = NoteValidProps | NoteInvalidProps

const InvalidNote = {} as NoteInvalidProps

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/

/**
 * Split a string into tokens related to note parts.
 * It returns an array of strings `[letter, accidental, octave, modifier]`
 *
 * It always returns an array
 *
 * @param {string} str
 * @return {Array} an array of note tokens
 * @example
 * tokenize("C#2") // => ["C", "#", "2", ""]
 * tokenize("Db3 major") // => ["D", "b", "3", "major"]
 * tokenize("major") // => ["", "", "", "major"]
 * tokenize("##") // => ["", "##", "", ""]
 * tokenize() // => ["", "", "", ""]
 */
export function tokenize(str: string) {
  const m = REGEX.exec(str) as string[]
  return [m[1].toUpperCase(), m[2].replace(/x/g, '##'), m[3], m[4]]
}

const SEMI = [0, 2, 4, 5, 7, 9, 11]
function properties(note: NoteName): NoteProps {
  const tokens = tokenize(note)
  if (tokens[0] === '' || tokens[3] !== '') return InvalidNote

  const letter = tokens[0] as NoteLetter
  const acc = tokens[1]
  const octStr = tokens[2]

  const step = (letter.charCodeAt(0) + 3) % 7
  const alt = acc[0] === 'b' ? -acc.length : acc.length
  const oct = octStr.length ? +octStr : undefined
  const fo = toFifthsOctaves({ step, alt, oct })

  const name = letter + acc + octStr
  const pc = letter + acc
  const chroma = (SEMI[step] + alt + 120) % 12
  const o = oct === undefined ? -100 : oct
  const height = SEMI[step] + alt + 12 * (o + 1)
  const midi = height >= 0 && height <= 127 ? height : undefined
  const freq =
    oct === undefined ? undefined : Math.pow(2, (height - 69) / 12) * 440

  return {
    name,
    letter,
    acc,
    pc,
    step,
    alt,
    oct,
    fo,
    height,
    chroma,
    midi,
    freq
  }
}

const CACHE: { [key in string]: NoteProps } = { undefined: InvalidNote }

/**
 * Get note properties. It returns an object with the following information:
 *
 * - name {string}: the note name. The letter is always in uppercase
 * - letter {string}: the note letter, always in uppercase
 * - acc {string}: the note accidentals
 * - octave {Number}: the octave or null if not present
 * - pc {string}: the pitch class (letter + accidentals)
 * - step {Number}: number equivalent of the note letter. 0 means C ... 6 means B.
 * - alt {Number}: number equivalent of accidentals (negative are flats, positive sharps)
 * - chroma {Number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...
 * - height {Number}: the note midi number but for any note including pitch classes (assumes oct is -100)
 * - midi {Number}: the note midi number (from 0 to 127)
 * - freq {Number}: the frequency using an equal temperament at 440Hz (undefined for pitch classes)
 *
 * This function *always* returns an object with all this properties, but if it"s
 * not a valid note all properties will be null.
 *
 * The returned object can"t be mutated.
 *
 * @param {string} note - the note name in scientific notation
 * @return {Object} an object with the properties (or an object will all properties
 * set to undefined if not valid note)
 *
 * @example
 * import { note } from '@tonaljs/tonal'
 * note("fx-3").name // => "F##-3"
 * note("invalid").name // => undefined
 * note('').name // => undefined
 * note("C#3").oct // => 3
 * note('C#').oct // => undefined
 */
export function note(note: NoteName | PitchProps): NoteProps {
  if (typeof note === 'string') {
    if (CACHE[note]) return CACHE[note]
    CACHE[note] = properties(note)
    return CACHE[note]
  } else {
    return fromPitchProps(note)
  }
}

const LETTERS = 'CDEFGAB'
/** @private */
export const stepToLetter = (step: number) => LETTERS[step]
const fillStr = (s: string, n: number) => Array(n + 1).join(s)
/** @private */
export const altToAcc = (alt: number) =>
  alt < 0 ? fillStr('b', -alt) : fillStr('#', alt)

function fromPitchProps(props: PitchProps): NoteProps {
  const { step, alt, oct } = props
  const letter = stepToLetter(step)
  if (!letter) return InvalidNote

  const pc = letter + altToAcc(alt)
  const noteName = oct || oct === 0 ? pc + oct : pc
  return note(noteName)
}
