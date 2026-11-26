import { describe, expect, it } from "vitest";
import * as Tonal from "./index";

// tonal's rule: invalid input gives an empty value ("", [], null, false or
// { empty: true }), never an exception. This calls every public function with
// invalid values and fails if one throws.
//
// Exempt, because they aren't music functions and a bad call is a
// programming error worth seeing: `deprecate` wraps a function to deprecate
// it, and `ChordType.add` registers a chord type when an app starts.
const EXEMPT = new Map([
  ["deprecate", "wraps a function"],
  ["Core.deprecate", "wraps a function"],
  ["Tonal.deprecate", "wraps a function"],
  ["ChordType.add", "registers a chord type"],
  ["ChordDictionary.add", "registers a chord type"],
]);

const INVALID: unknown[] = [
  undefined,
  null,
  5,
  NaN,
  "",
  "x",
  {},
  [],
  [null],
  ["x"],
  true,
];

type Fn = (...args: unknown[]) => unknown;

function publicFunctions(): [string, Fn][] {
  const fns: [string, Fn][] = [];
  for (const [ns, value] of Object.entries(Tonal)) {
    if (typeof value === "function") fns.push([ns, value as Fn]);
    else if (value && typeof value === "object") {
      for (const [name, fn] of Object.entries(value)) {
        if (typeof fn === "function" && name !== "default") {
          fns.push([`${ns}.${name}`, fn as Fn]);
        }
      }
    }
  }
  return fns;
}

// The calls that throw: every invalid value as 1 to 3 arguments (and no
// arguments), and the functions they return, called the same way
function throwingCalls(fn: Fn, depth = 0): string[] {
  const calls: unknown[][] = [[]];
  for (const value of INVALID) {
    for (let n = 1; n <= Math.min(Math.max(fn.length, 1), 3); n++) {
      calls.push(Array(n).fill(value));
    }
  }
  const failed: string[] = [];
  for (const args of calls) {
    try {
      const result = fn(...args);
      if (typeof result === "function" && depth === 0) {
        failed.push(...throwingCalls(result as Fn, 1));
      }
    } catch (e) {
      failed.push(`(${args.map((a) => JSON.stringify(a)).join(", ")}): ${e}`);
    }
  }
  return failed;
}

// Deprecated functions warn on every call
function quiet<T>(fn: () => T): T {
  const warn = console.warn;
  console.warn = () => {};
  try {
    return fn();
  } finally {
    console.warn = warn;
  }
}

describe("invalid input", () => {
  it("no public function throws", () => {
    const failures = quiet(() =>
      publicFunctions()
        .filter(([name]) => !EXEMPT.has(name))
        .map(([name, fn]) => [name, throwingCalls(fn)] as const)
        .filter(([, calls]) => calls.length > 0)
        .map(([name, calls]) => `${name}${calls[0]}`),
    );
    expect(failures).toEqual([]);
  });

  it("every exempt function exists", () => {
    const names = new Set(publicFunctions().map(([name]) => name));
    expect([...EXEMPT.keys()].filter((name) => !names.has(name))).toEqual([]);
  });

  it("gives the empty value of each type", () => {
    const T = Tonal;
    // the low-level pitch helpers give NaN (null in tonal 7)
    expect(T.chroma(null as never)).toBeNaN();
    expect(T.height({} as never)).toBeNaN();
    expect(T.coordinates(null as never)).toEqual([NaN]);
    expect(T.isPitch(T.pitch(null as never))).toBe(false);
    expect(T.midi(5 as never)).toBe(null);
    expect(T.coordToNote(null as never).empty).toBe(true);
    expect(T.coordToInterval(5 as never).empty).toBe(true);
    expect(T.accToAlt(null as never)).toBe(0);
    expect(T.altToAcc(NaN)).toBe("");
    expect(T.fillStr("#", 1.5)).toBe("");
    expect(T.tonicIntervalsTransposer(null as never, "C")(1)).toBe("");
    // lists
    expect(T.Collection.rotate(1, null as never)).toEqual([]);
    expect(T.Collection.permutations(5 as never)).toEqual([]);
    expect(T.Midi.pcset(5 as never)).toEqual([]);
    expect(T.Note.sortedNames(null as never)).toEqual([]);
    expect(T.Pcset.filter(["C"])(null as never)).toEqual([]);
    expect(T.Progression.toRomanNumerals("C", null as never)).toEqual([]);
    expect(T.Range.chromatic(null as never)).toEqual([]);
    expect(T.Scale.detect(null as never)).toEqual([]);
    expect(T.Scale.scaleNotes(5 as never)).toEqual([]);
    expect(T.RhythmPattern.binary(1.5)).toEqual([]);
    expect(T.RhythmPattern.hex(5 as never)).toEqual([]);
    // objects
    expect(T.TimeSignature.get(null as never).empty).toBe(true);
    expect(T.TimeSignature.parse({} as never)).toEqual([0, 0]);
    // a bad option falls back to its default
    expect(T.Note.sortedNames(["D4", "C4"], "x" as never)).toEqual([
      "C4",
      "D4",
    ]);
    expect(T.RhythmPattern.rotate([1, 0], NaN)).toEqual([1, 0]);
    // invalid notes sort as equal to the others
    expect(T.Note.ascending(T.Note.get("x"), T.Note.get("C4"))).toBe(0);
  });
});
