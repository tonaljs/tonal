/**
 * Pitch properties
 *
 * - {number} step - The step number: 0 = C, 1 = D, ... 6 = B
 * - {number} alt - Number of alterations: -2 = 'bb', -1 = 'b', 0 = '', 1 = '#', ...
 * - {number} [oct] = The octave (undefined when is a coord class)
 * - {number} [dir] = Interval direction (undefined when is not an interval)
 */
export type Pitch = {
  readonly step: number;
  readonly alt: number;
  readonly oct?: number; // undefined for pitch classes
  readonly dir?: 1 | -1; // undefined for notes
};

export type EmptyPitch = {
  readonly step: undefined;
  readonly alt: undefined;
  readonly oct: undefined;
  readonly dir: undefined;
};

export function isPitch(pitch: any): pitch is Pitch {
  return (
    pitch !== null &&
    typeof pitch === "object" &&
    typeof pitch.step === "number" &&
    typeof pitch.alt === "number"
  );
}
