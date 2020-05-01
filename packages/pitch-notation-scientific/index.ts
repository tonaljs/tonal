import {
  InvalidPitch,
  midi,
  freq,
  chroma,
  height,
  coordinates,
  NotePitch,
  PitchClass,
  Pitch,
  PitchCoordinates,
} from "@tonaljs/pitch";
import {
  parser,
  tokenizer,
  toName,
  PitchTokens,
} from "@tonaljs/pitch-notation";

// TOKENIZE
type PitchScientificTokens = PitchTokens & {
  letter: string;
  accidentals: string;
  octave: string;
};
const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

export const tokenize = tokenizer<PitchScientificTokens>((input) => {
  const m = REGEX.exec(input) as string[];
  return {
    input,
    matched: m[1] + m[2] + m[3],
    rest: m[4],
    letter: m[1].toUpperCase(),
    accidentals: m[2].replace(/x/g, "##"),
    octave: m[3],
  };
});

// PARSE
export type ValidParsedScientific = (PitchClass | NotePitch) & {
  // valid: true;
  empty: false;
  name: string;
  pc: string;
  letter: string;
  accidentals: string;
  acc: string; // deprecated
  octave: string;
  chroma: number;
  height: number;
  midi: number | null;
  freq: number | null;
  coord: PitchCoordinates;
};

export type InvalidParsedScientific = InvalidPitch & {
  // valid: false;
  empty: true;
  name: "";
  pc: "";
  letter: "";
  accidentals: "";
  acc: "";
  octave: "";
  chroma?: undefined;
  height?: undefined;
  midi?: undefined;
  freq?: undefined;
  coord: [];
};

export type ParsedScientific = ValidParsedScientific | InvalidParsedScientific;

const LETTERS = "CDEFGAB";
export const stepToLetter = (step: number) => LETTERS.charAt(step);
export const letterToStep = (letter: string) => (letter.charCodeAt(0) + 3) % 7;
export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);
export const altToAcc = (alt: number): string =>
  alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
export const accToAlt = (acc: string): number =>
  acc[0] === "b" ? -acc.length : acc.length;

export const parse = parser<ParsedScientific>((input) => {
  const { letter, accidentals, octave, rest } = tokenize(input);
  if (letter === "" || rest !== "") {
    return Invalid;
  }
  const pc = letter + accidentals;
  const name = pc + octave;
  const step = letterToStep(letter);
  const alt = accToAlt(accidentals);
  const pitch: Pitch = octave.length
    ? { step, alt, oct: +octave }
    : { step, alt };

  return {
    ...pitch,
    chroma: chroma(pitch),
    height: height(pitch),
    coord: coordinates(pitch),
    midi: midi(pitch),
    freq: freq(pitch),
    dir: undefined,
    name,
    pc,
    letter,
    accidentals,
    acc: accidentals,
    octave,
    // valid: true,
    empty: false,
  };
});

// NAME
export const name = toName((pitch) => {
  const { step = -1, alt, oct } = pitch || {};
  const letter = stepToLetter(step);
  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt || 0);
  return oct || oct === 0 ? pc + oct : pc;
});

// INVALID PARSED RESULT
const Invalid: InvalidParsedScientific = {
  // valid: false,
  empty: true,
  name: "",
  pc: "",
  letter: "",
  accidentals: "",
  acc: "",
  octave: "",
  coord: [],
};

export default { tokenize, parse, name };
