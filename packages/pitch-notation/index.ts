import { Pitch, EmptyPitch } from "@tonaljs/pitch";
import {
  pitchProps,
  PitchProperties,
  EmptyPitchProperties,
} from "@tonaljs/pitch-properties";

export type PitchTokens = {
  readonly valid: string;
  readonly rest: string;
  readonly letter: string;
  readonly accidentals: string;
  readonly acc: string; // deprecated
  readonly octave: string;
};

export type PitchTokenizer = (input: string) => PitchTokens;

export function validTokens(
  letter: string,
  accidentals: string,
  octave: string,
  rest: string
): PitchTokens {
  return {
    valid: letter + accidentals + octave,
    letter,
    accidentals,
    octave,
    rest,
    acc: accidentals,
  };
}

export function invalidTokens(str: string): PitchTokens {
  return {
    rest: str,
    valid: "",
    letter: "",
    accidentals: "",
    octave: "",
    acc: "",
  };
}

export type Notation = {
  parse: (str: string) => ParsedPitch;
  toString: (pitch: Pitch) => string;
};

type ValidPitch = { valid: true; empty: false };
type InvalidPitch = { valid: false; empty: true };

type PitchName = {
  readonly name: string;
  readonly pc: string;
};
type EmptyPitchName = {
  name: "";
  pc: "";
};

export type ValidParsedPitch = ValidPitch &
  PitchName &
  Omit<PitchTokens, "valid" | "rest"> &
  Pitch &
  PitchProperties;

export type InvalidParsedPitch = InvalidPitch &
  EmptyPitchName &
  Omit<PitchTokens, "valid" | "rest"> &
  EmptyPitch &
  EmptyPitchProperties;

export type ParsedPitch = ValidParsedPitch | InvalidParsedPitch;

const EmptyParsedPitch: InvalidParsedPitch = {
  valid: false,
  empty: true,
  step: undefined,
  alt: undefined,
  oct: undefined,
  dir: undefined,
  letter: "",
  accidentals: "",
  octave: "",
  acc: "",
  name: "",
  pc: "",
  chroma: undefined,
  height: undefined,
  midi: undefined,
  freq: undefined,
  coord: [],
};

export function pitchParser(
  tokenize: PitchTokenizer,
  build: (t: PitchTokens) => Pitch | undefined,
  name = pitchName
) {
  const cache: Record<string, ParsedPitch> = {};
  return function parse(input: string): ParsedPitch {
    if (cache[input]) return cache[input];

    const tokens = tokenize(input);
    const pitch = build(tokens);
    cache[input] = pitch
      ? validParsedPitch(tokens, pitch, name(tokens))
      : EmptyParsedPitch;
    return cache[input];
  };
}

export function validParsedPitch(
  tokens: PitchTokens,
  pitch: Pitch,
  name: PitchName
): ValidParsedPitch {
  const { accidentals, letter, octave, acc } = tokens;
  const { alt, step, oct } = pitch;
  return {
    accidentals,
    letter,
    octave,
    acc,
    ...name,
    alt,
    step,
    oct,
    ...pitchProps(pitch),
    valid: true,
    empty: false,
  };
}

function pitchName({ letter, accidentals, octave }: PitchTokens) {
  const pc = letter + accidentals;
  const name = pc + octave;
  return { pc, name };
}
