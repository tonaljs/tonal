import { transpose } from "@tonaljs/pitch-distance";
import { describe, expect, test } from "vitest";
import { add, subtract } from "./index";

/**
 * A second, independent implementation of interval arithmetic, used to find
 * errors (see also packages/pitch-distance/oracle.test.ts).
 *
 * It is not the truth: when it disagrees with `add` or `subtract`, either
 * one has a bug or they follow different conventions. It reads an interval
 * name as directed letter steps and semitones, adds or subtracts those, and
 * names the result again. It shares no code with the coordinate based
 * implementation.
 *
 * - The direction of the result comes from the sign of its letter steps:
 *   "2d" minus "1A" is "2dd", one letter step up and one semitone down.
 * - A unison goes in the direction of the sound: "1P" minus "1A" is "-1A".
 *   So "1d" and "-1A" are the same interval, named "-1A".
 */

// Semitones of the perfect or major interval of each simple number
const SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const PERFECTABLE = [true, false, false, true, true, false, false];

type Displacement = { steps: number; semitones: number };

function parse(name: string): Displacement {
  const m = /^(-?)(\d+)(P|M|m|A+|d+)$/.exec(name);
  if (!m) throw new Error(`The oracle can't parse the interval "${name}"`);
  const [, sign, num, q] = m;
  const size = Number(num) - 1;
  const simple = size % 7;
  const base = SEMITONES[simple] + 12 * Math.floor(size / 7);
  const alt =
    q === "P" || q === "M"
      ? 0
      : q === "m"
        ? -1
        : q[0] === "A"
          ? q.length
          : PERFECTABLE[simple]
            ? -q.length
            : -q.length - 1;
  const dir = sign === "-" ? -1 : 1;
  return { steps: dir * size, semitones: dir * (base + alt) };
}

function quality(simple: number, alt: number): string {
  if (PERFECTABLE[simple]) {
    return alt === 0 ? "P" : alt > 0 ? "A".repeat(alt) : "d".repeat(-alt);
  }
  return alt === 0
    ? "M"
    : alt === -1
      ? "m"
      : alt > 0
        ? "A".repeat(alt)
        : "d".repeat(-alt - 1);
}

function name({ steps, semitones }: Displacement): string {
  const dir = steps < 0 || (steps === 0 && semitones < 0) ? -1 : 1;
  const size = steps * dir;
  const simple = size % 7;
  const alt = semitones * dir - (SEMITONES[simple] + 12 * Math.floor(size / 7));
  return (dir < 0 ? "-" : "") + (size + 1) + quality(simple, alt);
}

function oracleAdd(a: string, b: string): string {
  const x = parse(a);
  const y = parse(b);
  return name({
    steps: x.steps + y.steps,
    semitones: x.semitones + y.semitones,
  });
}

function oracleSubtract(a: string, b: string): string {
  const x = parse(a);
  const y = parse(b);
  return name({
    steps: x.steps - y.steps,
    semitones: x.semitones - y.semitones,
  });
}

const QUALITIES_PERFECTABLE = ["dddd", "ddd", "dd", "d", "P", "A", "AA"];
const QUALITIES_MAJORABLE = ["dddd", "ddd", "dd", "d", "m", "M", "A", "AA"];
const INTERVALS = Array.from({ length: 15 }, (_, i) => i + 1).flatMap((num) => {
  const perfectable = PERFECTABLE[(num - 1) % 7];
  const qualities = perfectable ? QUALITIES_PERFECTABLE : QUALITIES_MAJORABLE;
  const extra = ["AAA", "AAAA"];
  return [...qualities, ...extra].flatMap((q) => [`${num}${q}`, `-${num}${q}`]);
});
const PAIRS = INTERVALS.flatMap((a) => INTERVALS.map((b) => [a, b] as const));
// The note every interval is measured from in the transposition tests
const FROM = "C4";

// Reports how many pairs failed and the first few of them
function failures(failed: string[]) {
  return { count: failed.length, first: failed.slice(0, 20) };
}

describe("interval arithmetic over every pair of intervals", () => {
  // These need no oracle and no conventions: adding intervals is
  // transposing by one and then by the other
  test("transposing by add(a, b) is transposing by a, then by b", () => {
    const failed: string[] = [];
    for (const [a, b] of PAIRS) {
      const ivl = add(a, b) ?? "";
      const expected = transpose(transpose(FROM, a), b);
      const actual = transpose(FROM, ivl);
      if (actual !== expected) {
        failed.push(
          `${a} + ${b} is ${ivl}, leads to ${actual}, not ${expected}`,
        );
      }
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });

  test("transposing by subtract(a, b), then by b, is transposing by a", () => {
    const failed: string[] = [];
    for (const [a, b] of PAIRS) {
      const ivl = subtract(a, b) ?? "";
      const expected = transpose(FROM, a);
      const actual = transpose(transpose(FROM, ivl), b);
      if (actual !== expected) {
        failed.push(
          `${a} - ${b} is ${ivl}, leads to ${actual}, not ${expected}`,
        );
      }
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });

  // Error finders: a mismatch is either a bug in one of them or a
  // convention to settle (see the oracle's conventions above)
  test("add agrees with the oracle", () => {
    const failed: string[] = [];
    for (const [a, b] of PAIRS) {
      const expected = oracleAdd(a, b);
      const actual = add(a, b) ?? "";
      if (actual !== expected) {
        failed.push(`${a} + ${b}: oracle ${expected}, add ${actual}`);
      }
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });

  test("subtract agrees with the oracle", () => {
    const failed: string[] = [];
    for (const [a, b] of PAIRS) {
      const expected = oracleSubtract(a, b);
      const actual = subtract(a, b) ?? "";
      if (actual !== expected) {
        failed.push(`${a} - ${b}: oracle ${expected}, subtract ${actual}`);
      }
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });
});

describe("interval oracle", () => {
  test.each([
    ["3m", "5P", "7m"],
    ["5P", "4P", "8P"],
    ["7M", "2m", "8P"],
    ["8P", "-2m", "7M"],
    ["-2m", "2m", "1P"],
    ["3M", "-5P", "-3m"],
    ["9M", "9M", "17M"],
    // letters up and sound down
    ["2m", "-1A", "2d"],
    ["2d", "-1A", "2dd"],
  ])("fact: %s + %s is %j", (a, b, expected) => {
    expect(oracleAdd(a, b)).toBe(expected);
  });

  test.each([
    ["5P", "3M", "3m"],
    ["3M", "5P", "-3m"],
    ["8P", "2m", "7M"],
    ["-3M", "-3M", "1P"],
    // letters up and sound down
    ["2d", "1A", "2dd"],
    ["2m", "1AA", "2dd"],
    ["2M", "1AAA", "2dd"],
    // letters down and sound up
    ["-2d", "-1A", "-2dd"],
  ])("fact: %s - %s is %j", (a, b, expected) => {
    expect(oracleSubtract(a, b)).toBe(expected);
  });

  test.each([
    // a unison goes in the direction of the sound
    ["1P", "1A", "-1A"],
    ["2m", "2M", "-1A"],
    ["1P", "1d", "1A"],
    // any number of augmented or diminished has a name
    ["4AAAA", "-1A", "4AAAAA"],
  ])("convention: %s - %s is %j", (a, b, expected) => {
    expect(oracleSubtract(a, b)).toBe(expected);
  });

  test("the oracle reads every interval as it names it", () => {
    const failed = INTERVALS.filter((ivl) => {
      const named = name(parse(ivl));
      const again = parse(named);
      const original = parse(ivl);
      return (
        again.steps !== original.steps || again.semitones !== original.semitones
      );
    });
    expect(failed).toEqual([]);
  });

  test("transposing by the oracle's sum is transposing by both", () => {
    const failed: string[] = [];
    for (const [a, b] of PAIRS) {
      const ivl = oracleAdd(a, b);
      const expected = transpose(transpose(FROM, a), b);
      const actual = transpose(FROM, ivl);
      if (actual !== expected) {
        failed.push(
          `${a} + ${b} = ${ivl}, leads to ${actual}, not ${expected}`,
        );
      }
    }
    expect(failures(failed)).toEqual({ count: 0, first: [] });
  });
});
