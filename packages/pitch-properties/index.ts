import { Pitch } from "@tonaljs/pitch";
import { PitchCoordinates, encode } from "@tonaljs/pitch-coordinates";

export type PitchProperties = {
  readonly coord: PitchCoordinates;
  readonly chroma: number;
  readonly height: number;
  readonly midi: number | null;
  readonly freq: number | null;
};

export type EmptyPitchProperties = {
  readonly coord: [];
  readonly chroma: undefined;
  readonly height: undefined;
  readonly midi: undefined;
  readonly freq: undefined;
};

const SEMI = [0, 2, 4, 5, 7, 9, 11];

export function pitchProps(pitch: Pitch): PitchProperties {
  const { step, alt, oct, dir } = pitch;
  const o = oct === undefined ? -100 : oct;
  const d = dir === undefined ? 1 : dir;
  const isNote = oct !== undefined && dir === undefined;

  const coord = encode(pitch);
  const chroma = (SEMI[step] + alt + 120) % 12;
  const height = d * (SEMI[step] + alt + 12 * o);
  const midi = isNote && height >= -12 && height <= 115 ? height + 12 : null;
  const freq = isNote ? Math.pow(2, (height - 57) / 12) * 440 : null;

  return { coord, chroma, height, midi, freq };
}
