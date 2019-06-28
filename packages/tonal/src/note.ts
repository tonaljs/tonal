import { decode, encode, Pitch, PitchCoordinates } from "./pitch";
import { Nothing, Tonal } from "./tonal";

export type NoteWithOctave = string;
export type PcName = string;
export type NoteName = NoteWithOctave | PcName;

export interface Note extends Pitch, Tonal {
  readonly name: NoteName;
  readonly letter: string;
  readonly acc: string;
  readonly pc: PcName;
  readonly chroma: number;
  readonly height: number;
  readonly coord: PitchCoordinates;
  readonly midi: number | null;
  readonly freq: number | null;
}

export interface NoNote extends Partial<Note> {
  empty: true;
  name: "";
}

const cache: Record<string, Note | NoNote> = {};

export function note(src: NoteName | Pitch): Note | NoNote {
  const name: NoteName =
    typeof src === "string"
      ? src
      : typeof src === "object"
      ? fromPitch(src)
      : "" + src;

  return (cache[name] = cache[name] || properties(name));
}

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
export function tokenize(str: string) {
  const m = REGEX.exec(str) as string[];
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}

/**
 * @private
 */
export function coordToNote(noteCoord: PitchCoordinates): Note {
  return note(decode(noteCoord)) as Note;
}

const SEMI = [0, 2, 4, 5, 7, 9, 11];
function properties(noteName: NoteName): Note | NoNote {
  const tokens = tokenize(noteName);
  if (tokens[0] === "" || tokens[3] !== "") {
    return Nothing as NoNote;
  }

  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];

  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = acc[0] === "b" ? -acc.length : acc.length;
  const oct = octStr.length ? +octStr : undefined;
  const coord = encode({ step, alt, oct });

  const name = letter + acc + octStr;
  const pc = letter + acc;
  const chroma = (SEMI[step] + alt + 120) % 12;
  const o = oct === undefined ? -100 : oct;
  const height = SEMI[step] + alt + 12 * (o + 1);
  const midi = height >= 0 && height <= 127 ? height : null;
  const freq = oct === undefined ? null : Math.pow(2, (height - 69) / 12) * 440;

  return {
    empty: false,
    acc,
    alt,
    chroma,
    coord,
    freq,
    height,
    letter,
    midi,
    name,
    oct,
    pc,
    step
  };
}

const fillStr = (s: string, n: number) => Array(n + 1).join(s);
export const stepToLetter = (step: number) => "CDEFGAB".charAt(step);
export const altToAcc = (alt: number) =>
  alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
function fromPitch(props: Pitch): NoteName {
  const { step, alt, oct } = props;
  const letter = stepToLetter(step);
  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}
