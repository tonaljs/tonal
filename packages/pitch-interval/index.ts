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

type MajorableNumber = 2 | 3 | 6 | 7 | 9 | 10 | 13 | 14;
type MajorableQuality = "d" | "m" | "M" | "A";
type PerfectableNumber = 1 | 4 | 5 | 8 | 11 | 12 | 15;
type PerfectableQuality = "d" | "P" | "A";
type Down = "" | "-";

/**
 * The common interval names up to 15, up or down, number first as tonal
 * writes them: "3M", "-5P", "9m"...
 */
export type KnownIntervalName =
  | `${Down}${MajorableNumber}${MajorableQuality}`
  | `${Down}${PerfectableNumber}${PerfectableQuality}`;

// Any string is still a valid name, since tonal parses more than the known
// names ("M3", "P-5", "+3M", "dd5", "AA4", "16M"). The known names are there for editors to
// suggest: `string & {}` keeps them, where a plain `string` would swallow them.
/**
 * An interval name. Any string is accepted, quality first too ("M3"); editors
 * suggest the common names (`KnownIntervalName`): every interval up to 15, up
 * or down, number first as tonal writes them, such as "3M" or "-5P".
 */
export type IntervalName = KnownIntervalName | (string & {});
export type IntervalLiteral = IntervalName | Pitch | NamedPitch;

// Any number of augmented or diminished: "A", "AA", "d", "ddddd"...
type Quality = "m" | "M" | "P" | `A${string}` | `d${string}`;
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
const INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d+|m|M|P|A+)";
// standard shorthand notation (with quality before number)
const INTERVAL_SHORTHAND_REGEX = "(A+|P|M|m|d+)([-+]?\\d+)";
const REGEX = new RegExp(
  "^(?:" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + ")$",
);

type IntervalTokens = [string, string];

/**
 * Split an interval name into `[number, quality]` (both strings). It accepts
 * the number first ("3M") or the quality first ("M3"). Anything that doesn't
 * match gives `["", ""]`.
 *
 * @example
 * tokenizeInterval("3M") // => ["3", "M"]
 * tokenizeInterval("M3") // => ["3", "M"]
 * tokenizeInterval("-5P") // => ["-5", "P"]
 */
export function tokenizeInterval(str?: IntervalName): IntervalTokens {
  const m = REGEX.exec(`${str}`);
  if (m === null) {
    return ["", ""];
  }
  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const cache = new Map<string, Interval>();

/**
 * Get the Interval object of an interval name ("5P" or "P5"), a pitch object
 * or an object with a `name`. Invalid input returns an object with
 * `empty: true` and `name: ""`.
 *
 * The properties are:
 *
 * - name: the interval name
 * - num: the interval number
 * - type: 'perfectable' or 'majorable'
 * - q: the interval quality (d, m, M, A)
 * - dir: interval direction (1 ascending, -1 descending)
 * - simple: the number reduced to an octave or less, keeping the octave
 *   (8, 15 and 22 are 8, 9 is 2) and the direction
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 *
 * @param {string} interval - the interval name
 * @return {Object} the interval properties
 *
 * @example
 * interval("5P").semitones // => 7
 * interval("P5").name // => "5P"
 * interval("m3").type // => "majorable"
 * interval("x").empty // => true
 */
export function interval(src: IntervalLiteral): Interval {
  return typeof src === "string"
    ? cached(src)
    : isPitch(src)
      ? interval(pitchName(src))
      : isNamedPitch(src)
        ? interval(src.name)
        : NoInterval;
}

// Only valid intervals are cached, so arbitrary input can't grow the cache
function cached(src: string): Interval {
  let value = cache.get(src);
  if (!value) {
    value = parse(src);
    if (!value.empty) cache.set(src, value);
  }
  return value;
}

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";
function parse(str?: string): Interval {
  const tokens = tokenizeInterval(str);
  if (tokens[0] === "") {
    return NoInterval;
  }
  const num = +tokens[0];
  if (num === 0) {
    return NoInterval;
  }
  const q = tokens[1] as Quality;
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];
  // 2, 3, 6 and 7 can't be perfect; 1, 4, 5 and 8 can't be major or minor
  if (t === "M" ? q === "P" : q === "M" || q === "m") {
    return NoInterval;
  }
  const type = t === "M" ? "majorable" : "perfectable";

  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  // Like music21's semi-simple: 15 and 22 reduce to 8, only a unison is 1
  const simple = dir * (step === 0 && Math.abs(num) > 1 ? 8 : step + 1);
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
 * Get the Interval object from its coordinates (`[fifths, octaves]`).
 *
 * The letter steps decide the direction of the interval, even when the sound
 * goes the other way: one letter step up and one semitone down is "2dd". Only
 * a unison takes its direction from the semitones: one semitone down is "-1A".
 *
 * @param forceDescending - deprecated, no longer needed: the letter steps
 * already give the direction (it was used for #243)
 *
 * @example
 * coordToInterval([1, 0]).name // => "5P"
 * coordToInterval([-1, 0]).name // => "-5P"
 */
export function coordToInterval(
  coord: PitchCoordinates,
  forceDescending?: boolean,
): Interval {
  if (!Array.isArray(coord)) return NoInterval;
  const [f, o = 0] = coord;
  // A fifth is 4 letter steps and 7 semitones, an octave 7 and 12
  const steps = f * 4 + o * 7;
  const isDescending = steps < 0 || (steps === 0 && f * 7 + o * 12 < 0);
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
