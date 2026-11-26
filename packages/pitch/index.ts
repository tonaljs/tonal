export interface NamedPitch {
  readonly name: string;
}

/** @deprecated Use NamedPitch instead. */
export interface Named {
  readonly name: string;
}

export interface NotFound extends NamedPitch {
  readonly empty: true;
  readonly name: "";
}

/**
 * Check if a value is an object with a string `name` property.
 *
 * @example
 * isNamedPitch({ name: "C4" }) // => true
 * isNamedPitch("C4") // => false
 */
export function isNamedPitch(src: unknown): src is NamedPitch {
  return src !== null &&
    typeof src === "object" &&
    "name" in src &&
    typeof src.name === "string"
    ? true
    : false;
}

type Fifths = number;
type Octaves = number;
export type Direction = 1 | -1;

export type PitchClassCoordinates = [Fifths];
export type NoteCoordinates = [Fifths, Octaves];
export type IntervalCoordinates = [Fifths, Octaves, Direction];
export type PitchCoordinates =
  PitchClassCoordinates | NoteCoordinates | IntervalCoordinates;

/**
 * Pitch properties
 *
 * - {number} step - The step number: 0 = C, 1 = D, ... 6 = B
 * - {number} alt - Number of alterations: -2 = 'bb', -1 = 'b', 0 = '', 1 = '#', ...
 * - {number} [oct] = The octave (undefined when is a coord class)
 * - {number} [dir] = Interval direction (undefined when is not an interval)
 */
export interface Pitch {
  readonly step: number;
  readonly alt: number;
  readonly oct?: number; // undefined for pitch classes
  readonly dir?: Direction; // undefined for notes
}

const SIZES = [0, 2, 4, 5, 7, 9, 11];
/**
 * Get the chroma (pitch class number, from 0 to 11) of a pitch, or `NaN` if
 * it isn't a pitch.
 *
 * @example
 * chroma({ step: 0, alt: 1 }) // => 1
 */
export const chroma = (pitch: Pitch) =>
  // NaN for an invalid pitch: null in tonal 7
  isPitch(pitch) ? (SIZES[pitch.step] + pitch.alt + 120) % 12 : NaN;

/**
 * Get the height of a pitch: its distance in semitones from C0 (so it is the
 * midi number minus 12). A descending interval has a negative height, and a
 * pitch without octave gets a number far below any note. It's `NaN` if it
 * isn't a pitch.
 *
 * @example
 * height({ step: 0, alt: 0, oct: 4 }) // => 48
 * height({ step: 0, alt: 0 }) // => -1200
 */
export const height = (pitch: Pitch) => {
  // NaN for an invalid pitch: null in tonal 7
  if (!isPitch(pitch)) return NaN;
  const { step, alt, oct, dir = 1 } = pitch;
  return dir * (SIZES[step] + alt + 12 * (oct === undefined ? -100 : oct));
};

/**
 * Get the midi number of a pitch, or `null` if it isn't a pitch, has no
 * octave or is outside the midi range (0 to 127).
 *
 * @example
 * midi({ step: 0, alt: 0, oct: 4 }) // => 60
 * midi({ step: 0, alt: 0 }) // => null
 */
export const midi = (pitch: Pitch) => {
  if (!isPitch(pitch)) return null;
  const h = height(pitch);
  return pitch.oct !== undefined && h >= -12 && h <= 115 ? h + 12 : null;
};

/**
 * Check if a value is an object with numeric `step` and `alt` properties.
 *
 * @example
 * isPitch({ step: 0, alt: 0 }) // => true
 * isPitch({ name: "C" }) // => false
 */
export function isPitch(pitch: unknown): pitch is Pitch {
  return pitch !== null &&
    typeof pitch === "object" &&
    "step" in pitch &&
    typeof pitch.step === "number" &&
    "alt" in pitch &&
    typeof pitch.alt === "number" &&
    !isNaN(pitch.step) &&
    !isNaN(pitch.alt)
    ? true
    : false;
}

// The number of fifths of [C, D, E, F, G, A, B]
const FIFTHS = [0, 2, 4, -1, 1, 3, 5];
// The number of octaves it span each step
const STEPS_TO_OCTS = FIFTHS.map((fifths: number) =>
  Math.floor((fifths * 7) / 12),
);

/**
 * Get the coordinates of a pitch object: `[fifths]` for a pitch class and
 * `[fifths, octaves]` for a note or an interval (the direction is applied to
 * both numbers). It's `[NaN]` if it isn't a pitch.
 *
 * @example
 * coordinates({ step: 4, alt: 0, oct: 4 }) // => [1, 4]
 * coordinates({ step: 4, alt: 0 }) // => [1]
 */
export function coordinates(pitch: Pitch): PitchCoordinates {
  // [NaN] for an invalid pitch: null in tonal 7
  if (!isPitch(pitch)) return [NaN];
  const { step, alt, oct, dir = 1 } = pitch;
  const f = FIFTHS[step] + 7 * alt;
  if (oct === undefined) {
    return [dir * f];
  }
  const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
}

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:
const FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];

/**
 * Get the pitch object from its coordinates (the inverse of `coordinates`).
 * Invalid coordinates give a pitch of `NaN`s, which `isPitch` rejects.
 *
 * @example
 * pitch([1]) // => { step: 4, alt: 0 }
 * pitch([1, 0]) // => { step: 4, alt: 0, oct: 0 }
 */
export function pitch(coord: PitchCoordinates): Pitch {
  // a pitch of NaNs for invalid coordinates (isPitch is false): null in tonal 7
  if (!Array.isArray(coord)) return { step: NaN, alt: NaN };
  const [f, o, dir] = coord;
  const step = FIFTHS_TO_STEPS[unaltered(f)];
  const alt = Math.floor((f + 1) / 7);
  if (o === undefined) {
    return { step, alt, dir };
  }
  const oct = o + 4 * alt + STEPS_TO_OCTS[step];
  return { step, alt, oct, dir };
}

// Return the number of fifths as if it were unaltered
function unaltered(f: number): number {
  const i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}
