import {
  PitchCoordinates,
  height,
  chroma,
  coordinates,
  IntervalPitch,
  InvalidPitch,
} from "@tonaljs/pitch";
import {
  parser,
  tokenizer,
  toName,
  PitchTokens,
} from "@tonaljs/pitch-notation";

/* tslint:disable:variable-name */

// TOKENIZE
type Type = "perfectable" | "majorable";
type Quality =
  | "dddd"
  | "ddd"
  | "dd"
  | "d"
  | "m"
  | "M"
  | "P"
  | "A"
  | "AA"
  | "AAA"
  | "AAAA";
type PitchIntervalTokens = PitchTokens & {
  number: string;
  quality: string;
};
// shorthand tonal notation (with quality after number)
const INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
// standard shorthand notation (with quality before number)
const INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX = new RegExp(
  "^(?:" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + ")(.*)$"
);
export const tokenize = tokenizer<PitchIntervalTokens>((input) => {
  const m = REGEX.exec(input) as string[];
  const [n, q] = m === null ? ["", ""] : m[1] ? [m[1], m[2]] : [m[4], m[3]];
  const rest = m[5];
  const matched = input.slice(0, input.length - rest.length);
  return {
    input,
    matched,
    rest,
    number: n,
    quality: q,
  };
});

// PARSE

type ValidParsedInterval = IntervalPitch & {
  // readonly valid: true;
  readonly empty: false;
  readonly name: string;
  readonly num: number;
  readonly q: Quality;
  readonly type: Type;
  readonly simple: number;
  readonly semitones: number;
  readonly chroma: number;
  readonly coord: PitchCoordinates;
};

type InvalidParsedInterval = InvalidPitch & {
  // readonly valid: false;
  readonly empty: true;
  readonly name: "";
  readonly num?: undefined;
  readonly q: "";
  readonly type: "";
  readonly simple?: undefined;
  readonly semitones?: undefined;
  readonly chroma?: undefined;
  readonly coord: [];
};

export type ParsedInterval = ValidParsedInterval | InvalidParsedInterval;

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";

export const parse = parser<ParsedInterval>((input) => {
  const { quality, number, rest } = tokenize(input);
  if (number === "" || rest !== "") {
    return Invalid;
  }
  const num = +number;
  const q = quality as Quality;
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];
  const type = t === "M" ? "majorable" : "perfectable";
  if (t === "M" && q === "P") {
    return Invalid;
  }

  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q);
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const pitch: IntervalPitch = { step, alt, oct, dir };

  return {
    ...pitch,
    // valid: true,
    empty: false,
    name,
    num,
    q,
    type,
    simple,
    semitones: height(pitch),
    chroma: chroma(pitch),
    coord: coordinates(pitch),
  };
});

function qToAlt(type: Type, q: string): number {
  return (q === "M" && type === "majorable") ||
    (q === "P" && type === "perfectable")
    ? 0
    : q === "m" && type === "majorable"
    ? -1
    : /^A+$/.test(q)
    ? q.length
    : /^d+$/.test(q)
    ? -1 * (type === "perfectable" ? q.length : q.length + 1)
    : 0;
}

export const name = toName((pitch) => {
  return "";
});

const Invalid: InvalidParsedInterval = {
  // valid: false,
  empty: true,
  name: "",
  q: "",
  type: "",
  coord: [],
};
