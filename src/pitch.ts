// this is an internal representation of a generic pitch (a note, pitchlass or interval)
export interface PitchProps {
  step: number
  alt: number
  oct?: number // undefined for pitch classes
  dir?: number // undefined for notes
}

export type Fifths = [number]
export type FifthsOctaves = [number, number]

const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// The number of octaves it span each step
const STEPS_TO_OCTS = FIFTHS.map((fifths: number) =>
  Math.floor((fifths * 7) / 12)
)

export function toFifthsOctaves(props: PitchProps): Fifths | FifthsOctaves {
  const { step, alt, oct, dir = 1 } = props
  const f = FIFTHS[step] + 7 * alt
  if (oct === undefined) return [dir * f]
  const o = oct - STEPS_TO_OCTS[step] - 4 * alt
  return [dir * f, dir * o]
}

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:
const FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6]

export function toPitchProps(fo: Fifths | FifthsOctaves, dir = 1): PitchProps {
  const [f, o] = fo
  const step = FIFTHS_TO_STEPS[unaltered(f)]
  const alt = Math.floor((f + 1) / 7)
  if (o === undefined) return { step, alt, dir }
  const oct = o + 4 * alt + STEPS_TO_OCTS[step]
  return { step, alt, oct, dir }
}

// Return the number of fifths as if it were unaltered
function unaltered(f: number): number {
  const i = (f + 1) % 7
  return i < 0 ? 7 + i : i
}
