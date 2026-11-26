import { describe, expect, it } from "vitest";
import * as Tonal from "./index";

// tonal's rule: invalid input gives an empty value ("", [], null, false or
// { empty: true }), never an exception. This calls every public function with
// invalid values and fails if one throws.
//
// These still throw, and are listed in the invalid-input ticket. Remove a name
// when its function is fixed; don't add new ones.
const KNOWN_THROWS = new Set([
  "accToAlt",
  "altToAcc",
  "Array.compact",
  "Array.permutations",
  "Array.rotate",
  "Array.shuffle",
  "Array.sortedNoteNames",
  "Array.sortedUniqNoteNames",
  "ChordDictionary.add",
  "ChordType.add",
  "chroma",
  "Collection.compact",
  "Collection.permutations",
  "Collection.rotate",
  "Collection.shuffle",
  "coordinates",
  "coordToInterval",
  "coordToNote",
  "Core.accToAlt",
  "Core.altToAcc",
  "Core.chroma",
  "Core.coordinates",
  "Core.coordToInterval",
  "Core.coordToNote",
  "Core.deprecate",
  "Core.fillStr",
  "Core.height",
  "Core.midi",
  "Core.pitch",
  "Core.tonicIntervalsTransposer",
  "deprecate",
  "fillStr",
  "height",
  "midi",
  "Midi.pcset",
  "Midi.pcsetDegrees",
  "Midi.pcsetNearest",
  "Midi.pcsetSteps",
  "Note.ascending",
  "Note.descending",
  "Note.sortedNames",
  "Note.sortedUniqNames",
  "Pcset.filter",
  "PcSet.filter",
  "pitch",
  "Progression.fromRomanNumerals",
  "Progression.toRomanNumerals",
  "Range.chromatic",
  "Range.numeric",
  "RhythmPattern.binary",
  "RhythmPattern.hex",
  "RhythmPattern.probability",
  "RhythmPattern.rotate",
  "Scale.detect",
  "Scale.scaleNotes",
  "TimeSignature.get",
  "TimeSignature.parse",
  "Tonal.accToAlt",
  "Tonal.altToAcc",
  "Tonal.chroma",
  "Tonal.coordinates",
  "Tonal.coordToInterval",
  "Tonal.coordToNote",
  "Tonal.deprecate",
  "Tonal.fillStr",
  "Tonal.height",
  "Tonal.midi",
  "Tonal.pitch",
  "Tonal.tonicIntervalsTransposer",
  "tonicIntervalsTransposer",
  "VoiceLeading.topNoteDiff",
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
        .filter(([name]) => !KNOWN_THROWS.has(name))
        .map(([name, fn]) => [name, throwingCalls(fn)] as const)
        .filter(([, calls]) => calls.length > 0)
        .map(([name, calls]) => `${name}${calls[0]}`),
    );
    expect(failures).toEqual([]);
  });

  it("the known exceptions still throw (remove the fixed ones)", () => {
    const fixed = quiet(() =>
      publicFunctions()
        .filter(([name]) => KNOWN_THROWS.has(name))
        .filter(([, fn]) => throwingCalls(fn).length === 0)
        .map(([name]) => name),
    );
    expect(fixed).toEqual([]);
  });
});
