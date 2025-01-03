import {
  coordinates,
  Direction,
  IntervalCoordinates,
  isNamedPitch,
  isPitch,
  NamedPitch,
  Pitch,
  pitch,
  PitchCoordinates,
} from "@tonaljs/pitch";

const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

export type IntervalName = string;
export type IntervalLiteral = IntervalName | Pitch | NamedPitch;

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
type Type = "perfectable" | "majorable";

export interface Interval extends Pitch, NamedPitch {
  readonly empty: boolean;
  readonly name: IntervalName;
  readonly num: number;
  readonly q: Quality;
  readonly type: Type;
  readonly step: number;
  readonly alt: number;
  readonly dir: Direction;
  readonly simple: number;
  readonly semitones: number;
  readonly chroma: number;
  readonly coord: IntervalCoordinates;
  readonly oct: number;
}

export type IntervalType = Interval;

const NoInterval: Interval = Object.freeze({
  empty: true,
  name: "",
  num: NaN,
  q: "" as Quality,
  type: "" as Type,
  step: NaN,
  alt: NaN,
  dir: NaN as Direction,
  simple: NaN,
  semitones: NaN,
  chroma: NaN,
  coord: [] as unknown as IntervalCoordinates,
  oct: NaN,
});

// shorthand tonal notation (with quality after number)
const INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
// standard shorthand notation (with quality before number)
const INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX = new RegExp(
  "^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$",
);

type IntervalTokens = [string, string];

/**
 * @private
 */
export function tokenizeInterval(str?: IntervalName): IntervalTokens {
  const m = REGEX.exec(`${str}`);
  if (m === null) {
    return ["", ""];
  }
  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const cache: { [key in string]: Interval } = {};

/**
 * Get interval properties. It returns an object with:
 *
 * - name: the interval name
 * - num: the interval number
 * - type: 'perfectable' or 'majorable'
 * - q: the interval quality (d, m, M, A)
 * - dir: interval direction (1 ascending, -1 descending)
 * - simple: the simplified number
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 *
 * @param {string} interval - the interval name
 * @return {Object} the interval properties
 *
 * @example
 * import { interval } from '@tonaljs/core'
 * interval('P5').semitones // => 7
 * interval('m3').type // => 'majorable'
 */
export function interval(src: IntervalLiteral): Interval {
  return typeof src === "string"
    ? cache[src] || (cache[src] = parse(src))
    : isPitch(src)
      ? interval(pitchName(src))
      : isNamedPitch(src)
        ? interval(src.name)
        : NoInterval;
}

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";
function parse(str?: string): Interval {
  const tokens = tokenizeInterval(str);
  if (tokens[0] === "") {
    return NoInterval;
  }
  const num = +tokens[0];
  const q = tokens[1] as Quality;
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];
  if (t === "M" && q === "P") {
    return NoInterval;
  }
  const type = t === "M" ? "majorable" : "perfectable";

  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q);
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const semitones = dir * (SIZES[step] + alt + 12 * oct);
  const chroma = (((dir * (SIZES[step] + alt)) % 12) + 12) % 12;
  const coord = coordinates({ step, alt, oct, dir }) as IntervalCoordinates;
  return {
    empty: false,
    name,
    num,
    q,
    step,
    alt,
    dir,
    type,
    simple,
    semitones,
    chroma,
    coord,
    oct,
  };
}

/**
 * @private
 *
 * forceDescending is used in the case of unison (#243)
 */
export function coordToInterval(
  coord: PitchCoordinates,
  forceDescending?: boolean,
): Interval {
  const [f, o = 0] = coord;
  const isDescending = f * 7 + o * 12 < 0;
  const ivl: IntervalCoordinates =
    forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
  return interval(pitch(ivl)) as Interval;
}

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

// return the interval name of a pitch
function pitchName(props: Pitch): string {
  const { step, alt, oct = 0, dir } = props;
  if (!dir) {
    return "";
  }
  const calcNum = step + 1 + 7 * oct;
  // this is an edge case: descending pitch class unison (see #243)
  const num = calcNum === 0 ? step + 1 : calcNum;
  const d = dir < 0 ? "-" : "";
  const type = TYPES[step] === "M" ? "majorable" : "perfectable";
  const name = d + num + altToQ(type, alt);
  return name;
}

function altToQ(type: Type, alt: number): Quality {
  if (alt === 0) {
    return type === "majorable" ? "M" : "P";
  } else if (alt === -1 && type === "majorable") {
    return "m";
  } else if (alt > 0) {
    return fillStr("A", alt) as Quality;
  } else {
    return fillStr("d", type === "perfectable" ? alt : alt + 1) as Quality;
  }
}
