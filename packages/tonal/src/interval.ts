import {
  decode,
  Direction,
  encode,
  IntervalCoordinates,
  Pitch,
  PitchCoordinates
} from "./pitch";
import { Nothing, Tonal } from "./tonal";

export type IntervalName = string;

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

export interface Interval extends Pitch, Tonal {
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

export interface NoInterval extends Partial<Interval> {
  readonly empty: true;
  readonly name: "";
}

export type IntervalTokens = [string, string];

// shorthand tonal notation (with quality after number)
const IVL_TNL = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
// standard shorthand notation (with quality before number)
const IVL_STR = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX = new RegExp("^" + IVL_TNL + "|" + IVL_STR + "$");

export function tokenize(str?: IntervalName): IntervalTokens {
  const m = REGEX.exec(`${str}`);
  if (m === null) {
    return ["", ""];
  }
  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const CACHE: { [key in string]: Interval | NoInterval } = {};

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
 * import { interval } from '@tonaljs/tonal'
 * interval('P5').semitones // => 7
 * interval('m3').type // => 'majorable'
 */
export function interval(ivl: IntervalName | Pitch): Interval | NoInterval {
  if (typeof ivl === "string") {
    if (CACHE[ivl]) {
      return CACHE[ivl];
    }
    CACHE[ivl] = properties(ivl);
    return CACHE[ivl];
  } else {
    return fromPitch(ivl);
  }
}

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";
function properties(str?: string): Interval | NoInterval {
  const tokens = tokenize(str);
  if (tokens[0] === "") {
    return Nothing as NoInterval;
  }
  const num = +tokens[0];
  const q = tokens[1] as Quality;
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];
  if (t === "M" && q === "P") {
    return Nothing as NoInterval;
  }
  const type = t === "M" ? "majorable" : "perfectable";

  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q);
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const semitones = dir * (SIZES[step] + alt + 12 * oct);
  const chroma = (((dir * (SIZES[step] + alt)) % 12) + 12) % 12;
  const coord = encode({ step, alt, oct, dir }) as IntervalCoordinates;
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
    oct
  };
}

/**
 * @private
 */
export function coordToInterval(coord: PitchCoordinates): Interval {
  const [f, o = 0] = coord;
  const isDescending = f * 7 + o * 12 < 0;
  const ivl: IntervalCoordinates = isDescending ? [-f, -o, -1] : [f, o, 1];
  return interval(decode(ivl)) as Interval;
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

function fromPitch(props: Pitch): Interval | NoInterval {
  const { step, alt, oct = 0, dir } = props;
  if (!dir) {
    return Nothing as NoInterval;
  }
  const num = step + 1 + 7 * oct;
  const d = dir < 0 ? "-" : "";
  const type = TYPES[step] === "M" ? "majorable" : "perfectable";
  const name = d + num + altToQ(type, alt);
  return interval(name);
}

const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

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
