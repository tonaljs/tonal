export type PitchClass = {
  readonly step: number;
  readonly alt: number;
  readonly oct?: undefined;
  readonly dir?: undefined;
};
export type NotePitch = {
  readonly step: number;
  readonly alt: number;
  readonly oct: number;
  readonly dir?: undefined;
};
export type IntervalPitch = {
  readonly step: number;
  readonly alt: number;
  readonly oct: number;
  readonly dir: 1 | -1;
};
export type Pitch = PitchClass | NotePitch | IntervalPitch;

export type InvalidPitch = {
  readonly step?: undefined;
  readonly alt?: undefined;
  readonly oct?: undefined;
  readonly dir?: undefined;
};

const SIZES = [0, 2, 4, 5, 7, 9, 11];
export const chroma = ({ step, alt }: Pitch) => (SIZES[step] + alt + 120) % 12;

export const height = ({ step, alt, oct, dir = 1 }: Pitch) =>
  dir * (SIZES[step] + alt + 12 * (oct === undefined ? -100 : oct));

export const midi = (pitch: Pitch) => {
  const h = height(pitch);
  return pitch.oct !== undefined && h >= -12 && h <= 115 ? h + 12 : null;
};

export const freq = (pitch: Pitch) =>
  pitch.oct !== undefined ? Math.pow(2, (height(pitch) - 57) / 12) * 440 : null;

// Coordinates are [fifths] (for pitch classes) and [fifths, octaves] for notes and intervals
export type PitchCoordinates = [number] | [number, number];

// The number of fifths of [C, D, E, F, G, A, B]
const FIFTHS = [0, 2, 4, -1, 1, 3, 5];
// The number of octaves it span each step
const STEPS_TO_OCTS = FIFTHS.map((fifths: number) =>
  Math.floor((fifths * 7) / 12)
);

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

export function pitch(coord: PitchCoordinates): Pitch {
  const [f, o] = coord;
  const step = FIFTHS_TO_STEPS[unaltered(f)];
  const alt = Math.floor((f + 1) / 7);
  if (o === undefined) {
    return { step, alt };
  }
  const oct = o + 4 * alt + STEPS_TO_OCTS[step];
  const dir = undefined;
  return { step, alt, oct, dir };
}

// Return the number of fifths as if it were unaltered
function unaltered(f: number): number {
  const i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}
