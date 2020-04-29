import { Pitch, InvalidPitch } from "@tonaljs/pitch";

/**
 * Tokens of a parsed pitch
 */
export type PitchTokens = {
  input: string;
  matched: string;
  rest: string;
};

export type ValidName = Pitch & {
  readonly empty: false;
  readonly name: string;
};

export type InvalidName = InvalidPitch & {
  readonly empty: true;
  readonly name: "";
};

export type ParsedPitch = ValidName | InvalidName;

/**
 * The three functions combined it's an (interchangeable) notation
 */
export type Notation = {
  tokenize: (input: string) => PitchTokens;
  parse: (input: string) => Pitch;
  name: (pitch: Pitch) => string;
};

export const tokenizer = <T extends PitchTokens>(
  tokenize: (input: string) => T
) => memoize<T>(tokenize);

export const parser = <T extends ParsedPitch>(parse: (input: string) => T) =>
  memoize<T>(parse);

// in the future, it may memoize the function
// it's a little bit tricky, don't know how to handle, yet
// ideas welcomed
export const toName = (toName: (pitch: Pitch) => string) => toName;

export function memoize<T>(fn: (input: string) => T) {
  const cache: Record<string, T> = {};
  return (input: string) => (cache[input] = cache[input] || fn(input));
}
