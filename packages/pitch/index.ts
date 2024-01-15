export interface NamedPitch {
  readonly name: string;
}

/*** @deprecated use NamedPitch */
export interface Named {
  readonly name: string;
}

export interface NotFound extends NamedPitch {
  readonly empty: true;
  readonly name: "";
}

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
  | PitchClassCoordinates
  | NoteCoordinates
  | IntervalCoordinates;

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
export const chroma = ({ step, alt }: Pitch) => (SIZES[step] + alt + 120) % 12;

export const height = ({ step, alt, oct, dir = 1 }: Pitch) =>
  dir * (SIZES[step] + alt + 12 * (oct === undefined ? -100 : oct));

export const midi = (pitch: Pitch) => {
  const h = height(pitch);
  return pitch.oct !== undefined && h >= -12 && h <= 115 ? h + 12 : null;
};

export function isPitch(pitch: unknown): pitch is Pitch {
  return pitch !== null &&
    typeof pitch === "object" &&
    ("empty" in pitch === false || pitch.empty === false) &&
    "step" in pitch &&
    typeof pitch.step === "number" &&
    "alt" in pitch &&
    typeof pitch.alt === "number"
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
 * Get coordinates from pitch object
 */
export function coordinates(pitch: Pitch): PitchCoordinates {
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
 * Get pitch from coordinate objects
 */
export function pitch(coord: PitchCoordinates): Pitch {
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
