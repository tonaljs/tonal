import {
  coordinates,
  isNamedPitch,
  isPitch,
  NamedPitch,
  Pitch,
  pitch,
  PitchCoordinates,
} from "@tonaljs/pitch";

const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";
type Accidentals = "#" | "b" | "##" | "bb";
type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** The 35 common pitch class names: "C" to "B" with nothing, "#", "b", "##" or "bb" */
export type KnownPcName = Letter | `${Letter}${Accidentals}`;
/** The common pitch class names at octaves 0 to 8 ("C4", "F#2", "Bb0"...) */
export type KnownNoteWithOctave = `${KnownPcName}${Octave}`;
export type KnownNoteName = KnownNoteWithOctave | KnownPcName;

// Any string is still a valid name, since tonal parses more than the known
// names ("c#4", "Cx4", "C-1", "Cbbb"). The known names are there for editors to
// suggest: `string & {}` keeps them, where a plain `string` would swallow them.
/**
 * A note name with octave. Any string is accepted; editors suggest the common
 * names (`KnownNoteWithOctave`): "C" to "B" with nothing, "#", "b", "##" or
 * "bb", at octaves 0 to 8, such as "C4" or "F#2".
 */
export type NoteWithOctave = KnownNoteWithOctave | (string & {});
/**
 * A pitch class name (a note without octave). Any string is accepted; editors
 * suggest the 35 common names (`KnownPcName`): "C" to "B" with nothing, "#",
 * "b", "##" or "bb", such as "C" or "Eb".
 */
export type PcName = KnownPcName | (string & {});
/**
 * A note name, with or without octave. Any string is accepted; editors suggest
 * the common names (`KnownNoteName`): "C" to "B" with nothing, "#", "b", "##"
 * or "bb", alone or at octaves 0 to 8, such as "Eb" or "C4".
 */
export type NoteName = KnownNoteName | (string & {});
export type NoteLiteral = NoteName | Pitch | NamedPitch;

export interface Note extends Pitch, NamedPitch {
  readonly empty: boolean;
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

export type NoteType = Note;

const NoNote: Note = Object.freeze({
  empty: true,
  name: "",
  letter: "",
  acc: "",
  pc: "",
  step: NaN,
  alt: NaN,
  chroma: NaN,
  height: NaN,
  coord: [] as unknown as PitchCoordinates,
  midi: null,
  freq: null,
});

const cache: Map<NoteLiteral | undefined, Note> = new Map();

/**
 * Get the note letter of a step (0 is C, 6 is B), or "" if the step is not
 * valid.
 *
 * @example
 * stepToLetter(0) // => "C"
 * stepToLetter(6) // => "B"
 */
export const stepToLetter = (step: number) => "CDEFGAB".charAt(step);
/**
 * Get the accidentals string of an alteration number.
 *
 * @example
 * altToAcc(2) // => "##"
 * altToAcc(-1) // => "b"
 * altToAcc(0) // => ""
 */
export const altToAcc = (alt: number): string =>
  alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
/**
 * Get the alteration number of an accidentals string.
 *
 * @example
 * accToAlt("##") // => 2
 * accToAlt("bb") // => -2
 * accToAlt("") // => 0
 */
export const accToAlt = (acc: string): number =>
  acc[0] === "b" ? -acc.length : acc.length;

/**
 * Get the Note object of a note literal (a note name, a pitch object or an
 * object with a `name`). Pitch classes ("Bb") and notes with octave ("Bb4")
 * are valid. Invalid input returns an object with `empty: true` and `name: ""`.
 *
 * @example
 * note("Bb4") // => { name: "Bb4", pc: "Bb", midi: 70, chroma: 10, ... }
 * note("Bb4").freq // => 466.1637615180899
 * note("x").empty // => true
 */
export function note(src: NoteLiteral): Note {
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
        : isNamedPitch(src)
          ? note(src.name)
          : NoNote;
  // Only valid notes are cached, so arbitrary input can't grow the cache
  if (!value.empty) cache.set(stringSrc, value);
  return value;
}

type NoteTokens = [string, string, string, string];

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d+|)\s*(.*)$/;

/**
 * Split a note name into `[letter, accidentals, octave, rest]` (all strings,
 * the letter in uppercase). Anything that doesn't match gives empty strings.
 *
 * @example
 * tokenizeNote("Bb4") // => ["B", "b", "4", ""]
 * tokenizeNote("C# major") // => ["C", "#", "", "major"]
 */
export function tokenizeNote(str: string): NoteTokens {
  const m = REGEX.exec(str) as string[];
  return m
    ? [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]]
    : ["", "", "", ""];
}

/**
 * Get the Note object from its coordinates: `[fifths]` for a pitch class or
 * `[fifths, octaves]` for a note.
 *
 * @example
 * coordToNote([1, 0]).name // => "G0"
 * coordToNote([0, 4]).name // => "C4"
 */
export function coordToNote(noteCoord: PitchCoordinates): Note {
  return note(pitch(noteCoord)) as Note;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

const SEMI = [0, 2, 4, 5, 7, 9, 11];
function parse(noteName: NoteName): Note {
  const tokens = tokenizeNote(noteName);
  if (tokens[0] === "" || tokens[3] !== "") {
    return NoNote;
  }

  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];

  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = accToAlt(acc);
  // "|| 0" turns the -0 of "C-0" into 0
  const oct = octStr.length ? Number(octStr) || 0 : undefined;
  const coord = coordinates({ step, alt, oct });

  // "C04" and "C-0" are named "C4" and "C0"
  const name = pitchName({ step, alt, oct });
  const pc = letter + acc;
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
