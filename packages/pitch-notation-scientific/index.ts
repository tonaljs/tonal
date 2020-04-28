import { ValidPitch, InvalidPitch } from "@tonaljs/pitch";
import {
  parser,
  tokenizer,
  toName,
  PitchTokens,
} from "@tonaljs/pitch-notation";
import {
  PitchProperties,
  EmptyPitchProperties,
  pitchProps,
} from "@tonaljs/pitch-properties";

type PitchScientificTokens = PitchTokens & {
  letter: string;
  accidentals: string;
  octave: string;
};

type ValidPitchScientific = ValidPitch & {
  valid: true;
  empty: false;
  name: string;
  pc: string;
  letter: string;
  accidentals: string;
  acc: string; // deprecated
  octave: string;
} & PitchProperties;

type InvalidPitchScientific = InvalidPitch & {
  valid: false;
  empty: true;
  name: "";
  pc: "";
  letter: "";
  accidentals: "";
  acc: "";
  octave: "";
} & EmptyPitchProperties;

export type PitchScientific = ValidPitchScientific | InvalidPitchScientific;

const LETTERS = "CDEFGAB";
export const stepToLetter = (step: number) => LETTERS.charAt(step);
export const letterToStep = (letter: string) => (letter.charCodeAt(0) + 3) % 7;
export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);
export const altToAcc = (alt: number): string =>
  alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
export const accToAlt = (acc: string): number =>
  acc[0] === "b" ? -acc.length : acc.length;
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

export const parse = parser<PitchScientific>((input) => {
  const { letter, accidentals, octave, rest } = tokenize(input);
  if (letter === "" || rest !== "") {
    return Invalid;
  }
  const pc = letter + accidentals;
  const name = pc + octave;
  const pitch: ValidPitch = {
    step: letterToStep(letter),
    alt: accToAlt(accidentals),
    oct: octave.length ? +octave : undefined,
  };

  return {
    ...pitch,
    ...pitchProps(pitch),
    name,
    pc,
    letter,
    accidentals,
    acc: accidentals,
    octave,
    valid: true,
    empty: false,
  };
});

export const name = toName((pitch) => {
  const { step = -1, alt, oct } = pitch || {};
  const letter = stepToLetter(step);
  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt || 0);
  return oct || oct === 0 ? pc + oct : pc;
});

const Invalid: InvalidPitchScientific = {
  valid: false,
  empty: true,
  name: "",
  pc: "",
  letter: "",
  accidentals: "",
  acc: "",
  octave: "",
  step: undefined,
  alt: undefined,
  oct: undefined,
  dir: undefined,
  chroma: undefined,
  midi: undefined,
  height: undefined,
  freq: undefined,
  coord: [],
};
