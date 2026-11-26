import { get as getDuration } from "@tonaljs/duration-value";
import {
  get as getTimeSignature,
  TimeSignatureLiteral,
} from "@tonaljs/time-signature";

/**
 * An exact time value in quarter notes, as `[numerator, denominator]`: a
 * quarter note is `[1, 1]`, a dotted quarter `[3, 2]`, a triplet eighth
 * `[1, 3]`, a 4/4 bar `[4, 1]`. Always reduced, with a positive denominator.
 */
export type Fraction = [n: number, d: number];

/**
 * A time value as input: a fraction (`[3, 2]`), an exact number (`1.5`) or a
 * string (`"3/2"`, `"1.5"`). Numbers must be multiples of 1/1024, so `0.1`
 * and `1 / 3` aren't accepted: write `[1, 3]` or `"1/3"`.
 */
export type TimeValue = Fraction | number | string;

/** A meter: the length of its bar and of each of its pulses, in quarters. */
export type Meter = {
  empty: boolean;
  name: string;
  bar: Fraction;
  beats: Fraction[];
};

const NO_METER: Meter = { empty: true, name: "", bar: [0, 1], beats: [] };

const gcd = (a: number, b: number): number =>
  b === 0 ? Math.abs(a) : gcd(b, a % b);

// A reduced fraction with a positive denominator, or null if it isn't one or
// its terms aren't safe integers
function reduce(n: number, d: number): Fraction | null {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0) {
    return null;
  }
  const g = gcd(n, d) || 1;
  const sign = d < 0 ? -1 : 1;
  return [(sign * n) / g + 0, (sign * d) / g];
}

// numbers are accepted when they are multiples of 1/1024
const GRID = 1024;

function fromNumber(value: number): Fraction | null {
  if (!Number.isFinite(value)) return null;
  const scaled = value * GRID;
  return Number.isInteger(scaled) ? reduce(scaled, GRID) : null;
}

const FRACTION_STRING = /^(-?\d+)\/(\d+)$/;
const NUMBER_STRING = /^-?\d+(\.\d+)?$/;

/**
 * Get a time value as a reduced fraction of quarter notes, or `null` if it
 * isn't valid. It takes a fraction (`[2, 4]`), an exact number (`1.5`: a
 * multiple of 1/1024) or a string (`"3/2"`, `"1.5"`). Numbers that aren't
 * exact, like `0.1` or `1 / 3`, give `null`: write `[1, 3]` or `"1/3"`.
 *
 * @param value - the time value
 * @returns the reduced fraction, or null
 * @example
 * Time.fraction(1.5) // => [3, 2]
 * Time.fraction("6/4") // => [3, 2]
 * Time.fraction([2, 4]) // => [1, 2]
 * Time.fraction(1 / 3) // => null
 */
export function fraction(value: TimeValue): Fraction | null {
  if (typeof value === "number") return fromNumber(value);
  if (typeof value === "string") {
    const text = value.trim();
    const match = FRACTION_STRING.exec(text);
    if (match) return reduce(+match[1], +match[2]);
    return NUMBER_STRING.test(text) ? fromNumber(+text) : null;
  }
  if (Array.isArray(value) && value.length === 2) {
    return reduce(value[0], value[1]);
  }
  return null;
}

/**
 * Add two time values. It returns `null` if one isn't valid.
 *
 * @example
 * Time.add([1, 3], [1, 6]) // => [1, 2]
 * Time.add(4, "1/3") // => [13, 3]
 */
export function add(a: TimeValue, b: TimeValue): Fraction | null {
  const x = fraction(a);
  const y = fraction(b);
  return x && y ? reduce(x[0] * y[1] + y[0] * x[1], x[1] * y[1]) : null;
}

/**
 * Subtract a time value from another. It returns `null` if one isn't valid.
 *
 * @example
 * Time.sub(4, [1, 3]) // => [11, 3]
 */
export function sub(a: TimeValue, b: TimeValue): Fraction | null {
  const y = fraction(b);
  return y ? add(a, [-y[0], y[1]]) : null;
}

/**
 * Multiply two time values: a duration by a number of times, or by a tuplet
 * ratio. It returns `null` if one isn't valid.
 *
 * @example
 * Time.mul([1, 2], [2, 3]) // => [1, 3]
 * Time.mul([3, 2], 4) // => [6, 1]
 */
export function mul(a: TimeValue, b: TimeValue): Fraction | null {
  const x = fraction(a);
  const y = fraction(b);
  return x && y ? reduce(x[0] * y[0], x[1] * y[1]) : null;
}

/**
 * Divide a time value by another: how many of the second fit in the first.
 * It returns `null` if one isn't valid or the divisor is 0.
 *
 * @example
 * Time.div(4, [1, 3]) // => [12, 1]
 */
export function div(a: TimeValue, b: TimeValue): Fraction | null {
  const x = fraction(a);
  const y = fraction(b);
  return x && y ? reduce(x[0] * y[1], x[1] * y[0]) : null;
}

/**
 * Compare two time values: negative if the first is earlier, 0 if they're
 * equal, positive if it's later, so it sorts a list. Invalid values sort as
 * equal (0).
 *
 * @example
 * Time.compare([1, 3], 0.5) // => -1
 * [[3, 2], [1, 3], 1].sort(Time.compare) // => [[1, 3], 1, [3, 2]]
 */
export function compare(a: TimeValue, b: TimeValue): number {
  const x = fraction(a);
  const y = fraction(b);
  return x && y ? Math.sign(x[0] * y[1] - y[0] * x[1]) : 0;
}

/**
 * Test whether two time values are equal: `[2, 4]`, `"1/2"` and `0.5` are.
 * It returns `false` if one isn't valid.
 *
 * @example
 * Time.equal([2, 4], 0.5) // => true
 */
export function equal(a: TimeValue, b: TimeValue): boolean {
  const x = fraction(a);
  const y = fraction(b);
  return !!x && !!y && x[0] === y[0] && x[1] === y[1];
}

/**
 * Get a time value as a number of quarter notes, for an app's output (an
 * audio library, MIDI ticks). It returns `null` if it isn't valid.
 *
 * @example
 * Time.toNumber([3, 2]) // => 1.5
 */
export function toNumber(value: TimeValue): number | null {
  const x = fraction(value);
  return x ? x[0] / x[1] : null;
}

/**
 * Get a time value as a string: `"3/2"`, or `"3"` for a whole number of
 * quarters. It returns `""` if it isn't valid.
 *
 * @example
 * Time.toString([3, 2]) // => "3/2"
 * Time.toString(4) // => "4"
 */
export function toString(value: TimeValue): string {
  const x = fraction(value);
  if (!x) return "";
  return x[1] === 1 ? `${x[0]}` : `${x[0]}/${x[1]}`;
}

/**
 * Get a meter from a time signature: the length of its bar and of each of
 * its pulses, in quarter notes. The pulses are the beats a musician counts:
 *
 * - simple meters (the lower number is 2 or 4): one per lower note, so 4/4
 *   has four `[1, 1]` and 2/2 two `[2, 1]`;
 * - compound meters (6/8, 9/8, 12/8, 3/8): one dotted note per three, so 6/8
 *   has two `[3, 2]`;
 * - additive meters: one per group, so 2+2+3/8 has `[1, 1]`, `[1, 1]` and
 *   `[3, 2]`;
 * - other meters (5/8, 7/8): one per lower note.
 *
 * It returns a meter with `empty: true` if the time signature isn't valid.
 *
 * @param timeSignature - a time signature, like "6/8" or "2+2+3/8"
 * @returns the meter
 * @example
 * Time.meter("6/8") // => { empty: false, name: "6/8", bar: [3, 1], beats: [[3, 2], [3, 2]] }
 * Time.meter("2+2+3/8").beats // => [[1, 1], [1, 1], [3, 2]]
 */
export function meter(timeSignature: TimeSignatureLiteral | Meter): Meter {
  if (isMeter(timeSignature)) return timeSignature;
  const ts = getTimeSignature(timeSignature as TimeSignatureLiteral);
  if (ts.empty) return NO_METER;
  const lower = ts.lower;
  const upper = Array.isArray(ts.upper)
    ? ts.upper.reduce((a, b) => a + b, 0)
    : ts.upper;
  if (!Number.isSafeInteger(upper * 4)) return NO_METER;
  const note = (count: number) => reduce(count * 4, lower) as Fraction;
  const beats: Fraction[] = ts.additive.length
    ? ts.additive.map(note)
    : ts.type === "compound"
      ? Array.from({ length: upper / 3 }, () => note(3))
      : Array.from({ length: upper }, () => note(1));
  return { empty: false, name: ts.name, bar: note(upper), beats };
}

function isMeter(value: unknown): value is Meter {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const { bar, beats } = value as Meter;
  return !!fraction(bar) && Array.isArray(beats) && beats.every(fraction);
}

// The sum of fractions, or null if one isn't valid or it overflows
function sum(values: (TimeValue | null)[]): Fraction | null {
  let total: Fraction | null = [0, 1];
  for (const value of values) {
    total = value === null || total === null ? null : add(total, value);
  }
  return total;
}

/**
 * Get the length of a duration value ("q", "eighth", "h." with dots) in
 * quarter notes. Tuplets are a multiplication: a triplet eighth is
 * `Time.mul(Time.duration("e"), [2, 3])`. It returns `null` if the name
 * isn't a duration.
 *
 * @example
 * Time.duration("q.") // => [3, 2]
 * Time.duration("e") // => [1, 2]
 * Time.duration("w") // => [4, 1]
 */
export function duration(name: string): Fraction | null {
  const value = getDuration(name);
  return value.empty ? null : reduce(value.fraction[0] * 4, value.fraction[1]);
}

const BAR_BEAT = /^(\d+):(\d+)(?:\+(\d+)\/(\d+))?$/;

/**
 * Get the position of a bar and beat in a meter, in quarter notes from the
 * start. The text is `"bar:beat"`, both from 1, with an optional fraction of
 * the beat: `"2:3+1/3"` is a third of the way into beat 3 of bar 2. Beats are
 * the meter's pulses (in 6/8, a dotted quarter). It returns `null` if the
 * text isn't valid in the meter.
 *
 * @param text - the bar and beat, like "2:3" or "2:3+1/3"
 * @param timeSignature - the meter, like "4/4"
 * @returns the position in quarter notes, or null
 * @example
 * Time.fromBarBeat("2:3", "4/4") // => [6, 1]
 * Time.fromBarBeat("2:3+1/3", "4/4") // => [19, 3]
 * Time.fromBarBeat("1:2", "6/8") // => [3, 2]
 */
export function fromBarBeat(
  text: string,
  timeSignature: TimeSignatureLiteral | Meter,
): Fraction | null {
  const m = meter(timeSignature);
  const match = typeof text === "string" ? BAR_BEAT.exec(text.trim()) : null;
  if (m.empty || !match) return null;
  const bar = +match[1];
  const beat = +match[2];
  const offset: Fraction = match[3] ? [+match[3], +match[4]] : [0, 1];
  if (bar < 1 || beat < 1 || beat > m.beats.length) return null;
  if (offset[1] === 0 || offset[0] >= offset[1]) return null;
  return sum([
    mul(bar - 1, m.bar),
    ...m.beats.slice(0, beat - 1),
    mul(offset, m.beats[beat - 1]),
  ]);
}

/**
 * Get the bar and beat of a position in a meter, as `"bar:beat"` from 1,
 * with the fraction of the beat when it's off the beat: the inverse of
 * `Time.fromBarBeat`. It returns `""` if the position is negative or isn't
 * valid.
 *
 * @param position - the position in quarter notes from the start
 * @param timeSignature - the meter, like "4/4"
 * @returns the bar and beat, like "2:3+1/3"
 * @example
 * Time.toBarBeat([19, 3], "4/4") // => "2:3+1/3"
 * Time.toBarBeat(28, "4/4") // => "8:1"
 */
export function toBarBeat(
  position: TimeValue,
  timeSignature: TimeSignatureLiteral | Meter,
): string {
  const m = meter(timeSignature);
  const pos = fraction(position);
  if (m.empty || !pos || pos[0] < 0) return "";
  const bars = div(pos, m.bar);
  if (!bars) return "";
  const bar = Math.floor(bars[0] / bars[1]);
  let inBar = sub(pos, mul(bar, m.bar) ?? NaN);
  for (let i = 0; inBar && i < m.beats.length; i++) {
    if (compare(inBar, m.beats[i]) < 0) {
      const offset = div(inBar, m.beats[i]);
      if (!offset) return "";
      const rest = offset[0] === 0 ? "" : `+${offset[0]}/${offset[1]}`;
      return `${bar + 1}:${i + 1}${rest}`;
    }
    inBar = sub(inBar, m.beats[i]);
  }
  return "";
}

/**
 * Get the positions of the onsets of a rhythm pattern (an array of 0s and
 * 1s, like `RhythmPattern` makes), with each step lasting `step` quarter
 * notes, from `start` (0 by default). It returns `[]` if the pattern isn't
 * an array of 0s and 1s or a time value isn't valid.
 *
 * @param pattern - the rhythm pattern
 * @param step - the length of a step: `[1, 2]` for eighth notes
 * @param start - where the pattern starts (optional)
 * @returns the position of each onset, in quarter notes
 * @example
 * Time.onsets([1, 0, 0, 1, 0, 0, 1, 0], [1, 2]) // => [[0, 1], [3, 2], [3, 1]]
 * Time.onsets([1, 1, 1], [1, 3], 4) // => [[4, 1], [13, 3], [14, 3]]
 */
export function onsets(
  pattern: number[],
  step: TimeValue,
  start: TimeValue = 0,
): Fraction[] {
  const size = fraction(step);
  const from = fraction(start);
  if (!Array.isArray(pattern) || !size || !from) return [];
  if (!pattern.every((x) => x === 0 || x === 1)) return [];
  const positions: Fraction[] = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] !== 1) continue;
    const position = sum([from, mul(size, i)]);
    if (!position) return [];
    positions.push(position);
  }
  return positions;
}
