/**
 * Pitch properties
 *
 * - {number} step - The step number: 0 = C, 1 = D, ... 6 = B
 * - {number} alt - Number of alterations: -2 = 'bb', -1 = 'b', 0 = '', 1 = '#', ...
 * - {number} [oct] = The octave (undefined when is a coord class)
 * - {number} [dir] = Interval direction (undefined when is not an interval)
 */
export type ValidPitch = {
  readonly step: number;
  readonly alt: number;
  readonly oct?: number; // undefined for pitch classes
  readonly dir?: 1 | -1; // undefined for notes
};

export type InvalidPitch = {
  readonly step: undefined;
  readonly alt: undefined;
  readonly oct: undefined;
  readonly dir: undefined;
};

export type Pitch = ValidPitch | InvalidPitch;

const SIZES = [0, 2, 4, 5, 7, 9, 11];
export const chroma = ({ step, alt }: ValidPitch) =>
  (SIZES[step] + alt + 120) % 12;

const height = ({ step, alt, oct = 0, dir = 1 }: ValidPitch) =>
  dir * (SIZES[step] + alt + 12 * oct);

export const midi = (pitch: ValidPitch) => {
  const h = height(pitch);
  return pitch.oct !== undefined && h >= -12 && h <= 115 ? h + 12 : null;
};

export const freq = (pitch: ValidPitch) =>
  pitch.oct !== undefined ? Math.pow(2, (height(pitch) - 57) / 12) * 440 : null;
