import {
  tokenizer,
  PitchTokens,
  fillStr,
  parser,
  toName,
} from "@tonaljs/pitch-notation";
import {
  ParsedScientific,
  parse as parseSci,
  name as nameSci,
} from "@tonaljs/pitch-notation-scientific";

// TOKENIZE
type PitchAbcTokens = PitchTokens & {
  letter: string;
  accidentals: string;
  octave: string;
};

const REGEX = /^(?:(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*))(.*)$/;

export const tokenize = tokenizer<PitchAbcTokens>((input) => {
  const m = REGEX.exec(input);
  const [accidentals, letter, octave, rest] = m
    ? [m[1], m[2], m[3], m[4]]
    : ["", "", "", ""];
  const matched = letter ? accidentals + letter + octave : "";
  return { input, matched, rest, accidentals, letter, octave };
});

type ParsedAbc = ParsedScientific & {
  scientificName: string;
};

export const parse = parser<ParsedAbc>((name) => {
  const scientificName = abcToScientificNotation(name);
  const parsed = parseSci(scientificName);
  if (!scientificName) return { ...parsed, scientificName };

  const { letter, accidentals, octave } = tokenize(name);

  return {
    ...parsed,
    scientificName,
    name,
    letter,
    accidentals,
    acc: accidentals,
    octave,
    pc: "",
  } as ParsedAbc;
});

export const name = toName((pitch) => {
  const scientificName = nameSci(pitch);
  return scientificToAbcNotation(scientificName);
});

/**
 * Convert a (string) note in ABC notation into a (string) note in scientific notation
 *
 * @example
 * abcToScientificNotation("c") // => "C5"
 */
export function abcToScientificNotation(str: string): string {
  const { letter, rest, accidentals: acc, octave: oct } = tokenize(str);
  if (letter === "" || rest !== "") {
    return "";
  }

  let o = 4;
  for (let i = 0; i < oct.length; i++) {
    o += oct.charAt(i) === "," ? -1 : 1;
  }
  const a =
    acc[0] === "_"
      ? acc.replace(/_/g, "b")
      : acc[0] === "^"
      ? acc.replace(/\^/g, "#")
      : "";
  return letter.charCodeAt(0) > 96
    ? letter.toUpperCase() + a + (o + 1)
    : letter + a + o;
}

/**
 * Convert a (string) note in scientific notation into a (string) note in ABC notation
 *
 * @example
 * scientificToAbcNotation("C#4") // => "^C"
 */
export function scientificToAbcNotation(input: string): string {
  const n = parseSci(input);
  if (n.empty || !n.oct) {
    return "";
  }
  const { letter, acc, oct } = n;
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o =
    oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
  return a + l + o;
}
