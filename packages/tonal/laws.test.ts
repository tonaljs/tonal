import { describe, expect, test } from "vitest";
import { Interval, Note } from "./index";

/**
 * The laws of notes and intervals.
 *
 * Intervals behave like vectors and notes like points: an interval can be
 * added to a note (transpose) or to another interval (add), and the
 * difference of two notes (distance) or two intervals (subtract) is an
 * interval. These tests check the laws that follow from that, over every
 * combination of a set of notes and intervals. They need no reference
 * implementation and no naming convention: when a law fails, at least one
 * of the functions involved gives a wrong result.
 */

const LETTERS = "CDEFGAB".split("");
const PITCH_CLASSES = LETTERS.flatMap((l) => [l + "b", l, l + "#"]);
// Include octaves outside the MIDI range (C-1 to G9) on purpose
const NOTES = [-1, 4, 10].flatMap((oct) => PITCH_CLASSES.map((pc) => pc + oct));

const QUALITIES = (num: number, all: boolean) => {
  const perfectable = [1, 4, 5].includes(((num - 1) % 7) + 1);
  if (perfectable) return all ? ["d", "P", "A"] : ["P"];
  return all ? ["d", "m", "M", "A"] : ["m", "M"];
};
const intervals = (max: number, all: boolean) =>
  Array.from({ length: max }, (_, i) => i + 1).flatMap((num) =>
    QUALITIES(num, all).flatMap((q) => [`${num}${q}`, `-${num}${q}`]),
  );
// Up to two octaves and a half, diminished to augmented
const INTERVALS = intervals(15, true);
// Within an octave and without augmented or diminished, to keep the number
// of triples small
const SIMPLE = intervals(8, false);

const pairs = <T>(xs: T[]) => xs.flatMap((a) => xs.map((b) => [a, b] as const));
const triples = <T>(xs: T[]) =>
  xs.flatMap((a) => xs.flatMap((b) => xs.map((c) => [a, b, c] as const)));

// Two interval names are the same interval when they move a note the same
// way: "1d" and "-1A" are both one semitone down with the same letter
const coord = (ivl: string | undefined) => {
  const parsed = Interval.get(ivl ?? "");
  return parsed.empty ? "(no interval)" : parsed.coord.join(",");
};
const pitchClass = (note: string) => Note.get(note).pc;
const height = (note: string) => Note.get(note).height;

// Collects the failures of a law, and reports how many and the first few
function law() {
  const failed: string[] = [];
  return {
    check(ok: boolean, message: () => string) {
      if (!ok) failed.push(message());
    },
    expectNoFailures() {
      expect({ count: failed.length, first: failed.slice(0, 20) }).toEqual({
        count: 0,
        first: [],
      });
    },
  };
}

describe("notes and intervals", () => {
  test("transposing by the distance gives back the note", () => {
    const l = law();
    for (const [a, b] of pairs(NOTES)) {
      const ivl = Note.distance(a, b);
      const result = Note.transpose(a, ivl);
      l.check(result === b, () => `${a} + (${a} to ${b} = ${ivl}) = ${result}`);
    }
    l.expectNoFailures();
  });

  test("the distance to a transposed note is the interval", () => {
    const l = law();
    for (const a of NOTES) {
      for (const ivl of INTERVALS) {
        const b = Note.transpose(a, ivl);
        const d = Note.distance(a, b);
        l.check(
          coord(d) === coord(ivl),
          () => `${a} to (${a} + ${ivl} = ${b}) is ${d}`,
        );
      }
    }
    l.expectNoFailures();
  });

  test("transposing twice is transposing by the sum", () => {
    const l = law();
    for (const a of NOTES) {
      for (const [i, j] of pairs(INTERVALS)) {
        const twice = Note.transpose(Note.transpose(a, i), j);
        const sum = Interval.add(i, j) ?? "";
        const once = Note.transpose(a, sum);
        l.check(
          twice === once,
          () => `${a} + ${i} + ${j} = ${twice}, but ${a} + ${sum} = ${once}`,
        );
      }
    }
    l.expectNoFailures();
  });

  test("distances add up", () => {
    const l = law();
    for (const [a, b, c] of triples(NOTES)) {
      const sum = Interval.add(Note.distance(a, b), Note.distance(b, c));
      const direct = Note.distance(a, c);
      l.check(
        coord(sum) === coord(direct),
        () => `${a} to ${b} to ${c} is ${sum}, but ${a} to ${c} is ${direct}`,
      );
    }
    l.expectNoFailures();
  });

  test("the semitones of the distance are the difference of heights", () => {
    const l = law();
    for (const [a, b] of pairs(NOTES)) {
      const ivl = Note.distance(a, b);
      const semitones = Interval.semitones(ivl);
      const diff = height(b) - height(a);
      l.check(
        semitones === diff,
        () => `${a} to ${b} is ${ivl} (${semitones} semitones), not ${diff}`,
      );
    }
    l.expectNoFailures();
  });

  test("transposing a pitch class is transposing the note and dropping the octave", () => {
    const l = law();
    for (const a of NOTES) {
      for (const ivl of INTERVALS) {
        const fromNote = pitchClass(Note.transpose(a, ivl));
        const fromPc = Note.transpose(pitchClass(a), ivl);
        l.check(
          fromNote === fromPc,
          () =>
            `${a} + ${ivl} is ${fromNote}, but ${pitchClass(a)} + ${ivl} is ${fromPc}`,
        );
      }
    }
    l.expectNoFailures();
  });

  test("the distance between pitch classes ignores octaves", () => {
    const l = law();
    for (const [a, b] of pairs(NOTES)) {
      const ivl = Note.distance(pitchClass(a), pitchClass(b));
      const result = Note.transpose(pitchClass(a), ivl);
      l.check(
        result === pitchClass(b),
        () =>
          `${pitchClass(a)} + (${pitchClass(a)} to ${pitchClass(b)} = ${ivl}) = ${result}`,
      );
    }
    l.expectNoFailures();
  });
});

describe("interval arithmetic", () => {
  test("adding a unison changes nothing", () => {
    const l = law();
    for (const i of INTERVALS) {
      const sum = Interval.add(i, "1P");
      l.check(coord(sum) === coord(i), () => `${i} + 1P = ${sum}`);
    }
    l.expectNoFailures();
  });

  test("the order of the sum doesn't matter", () => {
    const l = law();
    for (const [i, j] of pairs(INTERVALS)) {
      const ij = Interval.add(i, j);
      const ji = Interval.add(j, i);
      l.check(
        coord(ij) === coord(ji),
        () => `${i} + ${j} = ${ij}, but ${j} + ${i} = ${ji}`,
      );
    }
    l.expectNoFailures();
  });

  test("the grouping of the sum doesn't matter", () => {
    const l = law();
    for (const [i, j, k] of triples(SIMPLE)) {
      const left = Interval.add(Interval.add(i, j) ?? "", k);
      const right = Interval.add(i, Interval.add(j, k) ?? "");
      l.check(
        coord(left) === coord(right),
        () =>
          `(${i} + ${j}) + ${k} = ${left}, but ${i} + (${j} + ${k}) = ${right}`,
      );
    }
    l.expectNoFailures();
  });

  test("subtracting undoes adding", () => {
    const l = law();
    for (const [i, j] of pairs(INTERVALS)) {
      const sum = Interval.add(i, j) ?? "";
      const back = Interval.subtract(sum, j);
      l.check(coord(back) === coord(i), () => `${i} + ${j} - ${j} = ${back}`);
    }
    l.expectNoFailures();
  });

  test("an interval plus its opposite is a unison", () => {
    const l = law();
    for (const i of INTERVALS) {
      const opposite = Interval.subtract("1P", i) ?? "";
      const sum = Interval.add(i, opposite);
      l.check(coord(sum) === coord("1P"), () => `${i} + ${opposite} = ${sum}`);
    }
    l.expectNoFailures();
  });

  test("the semitones of a sum are the sum of the semitones", () => {
    const l = law();
    for (const [i, j] of pairs(INTERVALS)) {
      const sum = Interval.add(i, j);
      const semitones = Interval.semitones(sum ?? "");
      const expected = Interval.semitones(i) + Interval.semitones(j);
      l.check(
        semitones === expected,
        () => `${i} + ${j} = ${sum} (${semitones} semitones), not ${expected}`,
      );
    }
    l.expectNoFailures();
  });
});

describe("simplify, invert, pitch class, negate and multiply", () => {
  const octave = (i: string) => (Interval.get(i).dir < 0 ? "-8P" : "8P");

  test("simplifying keeps the pitch class and the direction", () => {
    const l = law();
    for (const i of INTERVALS) {
      const s = Interval.simplify(i);
      const n = Math.abs(Interval.num(s));
      l.check(
        Interval.pitchClass(s) === Interval.pitchClass(i) &&
          Interval.get(s).dir === Interval.get(i).dir &&
          n >= 1 &&
          n <= 8 &&
          Interval.simplify(s) === s,
        () => `${i} simplifies to ${s}`,
      );
    }
    l.expectNoFailures();
  });

  test("only a unison simplifies to a unison", () => {
    const l = law();
    for (const i of INTERVALS) {
      const s = Interval.simplify(i);
      const isUnison = Math.abs(Interval.num(i)) === 1;
      l.check(
        (Math.abs(Interval.num(s)) === 1) === isUnison,
        () => `${i} simplifies to ${s}`,
      );
    }
    l.expectNoFailures();
  });

  test("an interval and its inversion make an octave", () => {
    const l = law();
    for (const i of INTERVALS) {
      const inv = Interval.invert(i);
      const sum = Interval.add(Interval.simplify(i), inv);
      l.check(
        coord(sum) === coord(octave(i)),
        () => `${Interval.simplify(i)} + (inversion of ${i} = ${inv}) = ${sum}`,
      );
    }
    l.expectNoFailures();
  });

  test("inverting twice is simplifying", () => {
    const l = law();
    for (const i of INTERVALS) {
      const twice = Interval.invert(Interval.invert(i));
      const s = Interval.simplify(i);
      l.check(twice === s, () => `${i} inverted twice is ${twice}, not ${s}`);
    }
    l.expectNoFailures();
  });

  test("the pitch class of an interval is the distance between pitch classes", () => {
    const l = law();
    for (const a of NOTES) {
      for (const i of INTERVALS) {
        const b = Note.transpose(a, i);
        const d = Note.distance(pitchClass(a), pitchClass(b));
        const pc = Interval.pitchClass(i);
        l.check(
          d === pc,
          () =>
            `${pitchClass(a)} to ${pitchClass(b)} is ${d}, not ${pc} (${i})`,
        );
      }
    }
    l.expectNoFailures();
  });

  test("inverting and negating give the same pitch class", () => {
    const l = law();
    for (const i of INTERVALS) {
      const inv = Interval.pitchClass(Interval.invert(i));
      const neg = Interval.pitchClass(Interval.negate(i));
      l.check(inv === neg, () => `${i}: inverted ${inv}, negated ${neg}`);
    }
    l.expectNoFailures();
  });

  test("an interval plus its negation is a unison", () => {
    const l = law();
    for (const i of INTERVALS) {
      const neg = Interval.negate(i);
      const sum = Interval.add(i, neg);
      l.check(
        coord(sum) === coord("1P") &&
          neg === Interval.subtract("1P", i) &&
          coord(Interval.negate(neg)) === coord(i),
        () => `${i} + ${neg} = ${sum}`,
      );
    }
    l.expectNoFailures();
  });

  test("abs is the interval or its negation, whichever ascends", () => {
    const l = law();
    for (const i of INTERVALS) {
      const a = Interval.abs(i);
      const isOneOf =
        coord(a) === coord(i) || coord(a) === coord(Interval.negate(i));
      l.check(
        isOneOf &&
          Interval.get(a).dir === 1 &&
          a === Interval.abs(Interval.negate(i)) &&
          a === Interval.abs(a),
        () => `abs of ${i} is ${a}`,
      );
    }
    l.expectNoFailures();
  });

  test("multiplying is adding the interval that many times", () => {
    const l = law();
    for (const i of INTERVALS) {
      l.check(Interval.multiply(i, 0) === "1P", () => `${i} * 0`);
      l.check(
        Interval.multiply(i, -1) === Interval.negate(i),
        () => `${i} * -1 is ${Interval.multiply(i, -1)}`,
      );
      for (let n = -4; n <= 4; n++) {
        const next = Interval.multiply(i, n + 1);
        const sum = Interval.add(Interval.multiply(i, n), i);
        const semitones = Interval.semitones(next);
        l.check(
          coord(next) === coord(sum) &&
            semitones === (n + 1) * Interval.semitones(i),
          () =>
            `${i} * ${n + 1} is ${next} (${semitones}), but adding gives ${sum}`,
        );
      }
    }
    l.expectNoFailures();
  });
});
