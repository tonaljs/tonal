import { Pitch } from "@tonaljs/pitch";
import {
  PitchTokens,
  invalidTokens,
  validTokens,
  pitchParser,
  Notation,
} from "@tonaljs/pitch-notation";

const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

export function tokenize(str: string): PitchTokens {
  const m = REGEX.exec(str) as string[];
  return m[0] === ""
    ? invalidTokens(str)
    : validTokens(m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]);
}

const LETTERS = "CDEFGAB";
export const stepToLetter = (step: number) => LETTERS.charAt(step);
export const letterToStep = (letter: string) => (letter.charCodeAt(0) + 3) % 7;
export const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);
export const altToAcc = (alt: number): string =>
  alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
export const accToAlt = (acc: string): number =>
  acc[0] === "b" ? -acc.length : acc.length;

function buildPitch(tokens: PitchTokens): Pitch | undefined {
  if (tokens.letter !== "" && tokens.rest === "") {
    const step = letterToStep(tokens.letter);
    const alt = accToAlt(tokens.accidentals);
    const oct = tokens.octave.length ? +tokens.octave : undefined;
    return { step, alt, oct };
  }
}

export const parse = pitchParser(tokenize, buildPitch);

export const toString = (pitch: Pitch): string => {
  const { step, alt, oct } = pitch;
  const letter = stepToLetter(step);
  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
};

export const ScientificNotation: Notation = { parse, toString };

export default ScientificNotation;
