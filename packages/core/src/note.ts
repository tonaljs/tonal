import { isNamed, Named } from "./named";
import { decode, encode, isPitch, Pitch, PitchCoordinates } from "./pitch";
import { fillStr } from "./utils";

export type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type NoteWithOctave = `${Letter}${string}${number}`;
export type PcName = `${Letter | ""}${string}`;
export type NoteName = NoteWithOctave | PcName;
export type NoteLiteral = NoteName | Pitch | Named;

export interface Note extends Pitch, Named {
  readonly empty: boolean;
  readonly name: NoteName;
  readonly letter: Letter;
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
  pc: "";
  acc: "";
}
const NoNote: NoNote = { empty: true, name: "", pc: "", acc: "" };

const cache: Map<NoteLiteral | undefined, Note | NoNote> = new Map();

export const stepToLetter = (step: number) => "CDEFGAB".charAt(step);
export const altToAcc = (alt: number): string =>
  alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
export const accToAlt = (acc: string): number =>
  acc[0] === "b" ? -acc.length : acc.length;

/**
 * Given a note literal (a note name or a note object), returns the Note object
 * @example
 * note('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */
export function note(src: NoteLiteral): Note | NoNote {
  const stringSrc = JSON.stringify(src);

  const cached = cache.get(stringSrc);
  if (cached) {
    return cached;
  }

  const value =
    typeof src === "string"
      ? parse(src)
      : isPitch(src)
      ? note(pitchName(src))
      : isNamed(src)
      ? note(src.name)
      : NoNote;
  cache.set(stringSrc, value);
  return value;
}

type NoteTokens = [Letter | "", string, number | undefined, string];

const REGEX = /^([a-gA-G]?)(#+|b+|x+|)(-?\d*)\s*(.*)$/;

/**
 * @private
 */
export function tokenizeNote(str: string): NoteTokens {
  const m = REGEX.exec(str) as string[];
  return [
    m[1].toUpperCase() as NoteTokens[0],
    m[2].replaceAll("x", "##"),
    m[3] === "" ? undefined : parseInt(m[3], 10),
    m[4],
  ];
}

/**
 * @private
 */
export function coordToNote(noteCoord: PitchCoordinates): Note {
  return note(decode(noteCoord)) as Note;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

const SEMI = [0, 2, 4, 5, 7, 9, 11];
function parse(noteName: NoteName): Note | NoNote {
  const [letter, acc, oct, invalidStr] = tokenizeNote(noteName);
  if (letter === "" || invalidStr !== "") {
    return NoNote;
  }

  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = accToAlt(acc);
  const coord = encode({ step, alt, oct });

  const name = `${letter}${acc}${oct ?? ""}` as const;
  const pc = `${letter}${acc}`;
  const chroma = (SEMI[step] + alt + 120) % 12;
  const height =
    oct === undefined
      ? mod(SEMI[step] + alt, 12) - 12 * 99
      : SEMI[step] + alt + 12 * (oct + 1);
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
    step,
  };
}

function pitchName(props: Pitch): NoteName {
  const { step, alt, oct } = props;
  const letter = stepToLetter(step);
  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}
