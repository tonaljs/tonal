import { ValidPitch, InvalidPitch } from "@tonaljs/pitch";
import {
  parser,
  tokenizer,
  toName,
  PitchTokens,
} from "@tonaljs/pitch-notation";
import { encode } from "@tonaljs/pitch-coordinates";
import { IntervalCoordinates } from "../modules";

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

type ValidPitchInterval = ValidPitch & {
  readonly valid: true;
  readonly empty: false;
  readonly name: string;
  readonly num: number;
  readonly q: Quality;
  readonly type: Type;
  readonly simple: number;
  readonly semitones: number;
  readonly chroma: number;
  readonly coord: IntervalCoordinates;
  readonly oct: number;
};

type InvalidPitchInterval = InvalidPitch & {
  valid: false;
  empty: true;
  name: "";
  num: undefined;
  q: "";
};

export type PitchInterval = ValidPitchInterval | InvalidPitchInterval;

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";

export const parse = parser<PitchInterval>((input) => {
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
  const semitones = dir * (SIZES[step] + alt + 12 * oct);
  const chroma = (((dir * (SIZES[step] + alt)) % 12) + 12) % 12;
  const coord = encode({ step, alt, oct, dir }) as IntervalCoordinates;

  return {
    valid: true,
    empty: false,
    name,
    num,
    q,
    step,
    alt,
    oct,
    dir,
    type,
    simple,
    semitones,
    chroma,
    coord,
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

const Invalid: InvalidPitchInterval = {
  valid: false,
  empty: true,
  name: "",
  q: "",
  num: undefined,
  step: undefined,
  alt: undefined,
  oct: undefined,
  dir: undefined,
};
