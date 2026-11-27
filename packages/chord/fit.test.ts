import { note } from "@tonaljs/pitch-note";
import { describe, expect, test } from "vitest";
import {
  degreeOf,
  fitDegree,
  fitNote,
  formula,
  noteOf,
  tensions,
} from "./index";

// source degree × target chord type
const MATRIX = `
deg  maj7   7      m7     m7b5   dim7   7sus4  sus4   6      m6     mMaj7  7#5    7alt   M      m      aug    7b9    13     maj7#11
b9   9      b9     9      9      9      b9     9      9      9      9      9      #9     9      9      9      b9     9      9
9    9      9      9      9      9      9      9      9      9      9      9      #9     9      9      9      b9     9      9
#9   9      #9     b3     b3     b3     9      9      9      b3     b3     9      #9     9      b3     9      #9     9      9
3    3      3      b3     b3     b3     4      4      3      b3     b3     3      3      3      b3     3      3      3      3
11   #11    #11    11     11     11     4      4      #11    11     11     #11    #11    #11    11     #11    #11    #11    #11
#11  #11    #11    11     b5     b5     4      4      #11    11     11     #11    #11    #11    11     #11    #11    #11    #11
5    5      5      5      b5     b5     5      5      5      5      5      #5     #5     5      5      #5     5      5      5
b13  13     b13    b13    b13    b13    13     13     6      6      13     #5     #5     13     b13    #5     b13    13     13
13   13     13     13     b13    bb7    13     13     6      6      13     13     13     13     13     13     13     13     13
b7   7      b7     b7     b7     bb7    b7     b7     7      7      7      b7     b7     b7     b7     b7     b7     b7     7
7    7      b7     b7     b7     7      b7     7      7      7      7      b7     b7     7      7      7      b7     b7     7
`;

const TYPES = [
  "maj7",
  "7",
  "m7",
  "m7b5",
  "dim7",
  "7sus4",
  "sus4",
  "6",
  "m6",
  "mMaj7",
  "7#5",
  "7alt",
  "",
  "m",
  "aug",
  "7b9",
  "13",
  "maj7#11",
];
const ROOTS = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

describe("Chord.fitDegree", () => {
  test("the rule table", () => {
    const [header, ...rows] = MATRIX.trim().split("\n");
    const types = header.split(/\s+/).slice(1);
    for (const row of rows) {
      const [degree, ...expected] = row.split(/\s+/);
      types.forEach((type, i) => {
        const chord = "C" + (type === "M" ? "" : type);
        expect(fitDegree(degree, chord), `${degree} on ${chord}`).toBe(
          expected[i],
        );
      });
    }
  });

  test("the root stays", () => {
    for (const type of TYPES) expect(fitDegree("1", "C" + type)).toBe("1");
  });

  test("chord types without root and other numbers", () => {
    expect(fitDegree("3", "m7")).toBe("b3");
    expect(fitDegree("2", "C9")).toBe("9");
    expect(fitDegree("4", "C7")).toBe("#11");
    expect(fitDegree("6", "C13")).toBe("13");
    expect(fitDegree("13", "C6")).toBe("6");
  });

  test("the scale decides before the tensions", () => {
    expect(fitDegree("9", "Fm7b5", { scale: "F locrian" })).toBe("b9");
    expect(fitDegree("13", "Dm7", { scale: "D dorian" })).toBe("13");
    expect(fitDegree("13", "Dm7", { scale: "D minor" })).toBe("b13");
    expect(fitDegree("11", "C7", { scale: "C mixolydian" })).toBe("11");
    // a scale on another tonic counts from the chord's root
    expect(fitDegree("13", "Dm7", { scale: "C major" })).toBe("13");
    // chord tones still come first
    expect(fitDegree("3", "Cm7", { scale: "C major" })).toBe("b3");
  });

  test("invalid input", () => {
    expect(fitDegree("x", "C7")).toBe("");
    expect(fitDegree("3", "x")).toBe("");
    expect(fitDegree("3", "C7", { scale: "C nope" })).toBe("");
    expect(fitDegree("3", "C7", { scale: "nope" })).toBe("");
    // @ts-expect-error invalid input
    expect(fitDegree(3, "C7")).toBe("");
  });
});

describe("Chord.fitNote", () => {
  test("examples", () => {
    expect(fitNote("E4", "C7", "Fm7b5")).toBe("Ab4");
    expect(fitNote("D4", "C7", "Fm7b5")).toBe("G4");
    expect(fitNote("D4", "C7", "Fm7b5", { scale: "F locrian" })).toBe("Gb4");
    expect(fitNote("F4", "C7", "Fmaj7")).toBe("B4");
    expect(fitNote("E4", "C7", "F7sus4")).toBe("Bb4");
  });

  test("a phrase is a map", () => {
    const bar = ["C3", "E3", "G3", "A3"];
    expect(bar.map((n) => fitNote(n, "C7", "Ebm7"))).toEqual([
      "Eb3",
      "Gb3",
      "Bb3",
      "C4",
    ]);
    // the root moves the nearest way: down a whole step, up a tritone
    expect(bar.map((n) => fitNote(n, "C7", "Bb7"))).toEqual([
      "Bb2",
      "D3",
      "F3",
      "G3",
    ]);
    expect(bar.map((n) => fitNote(n, "C7", "F#7"))).toEqual([
      "F#3",
      "A#3",
      "C#4",
      "D#4",
    ]);
  });

  test("slash chords", () => {
    expect(fitNote("C3", "C7", "F7/Eb")).toBe("F3");
    expect(fitNote("C3", "C7", "F7/Eb", { bass: true })).toBe("Eb3");
    // only the root role moves to the bass
    expect(fitNote("E3", "C7", "F7/Eb", { bass: true })).toBe("A3");
    // the bass of the source chord doesn't change the roles
    expect(fitNote("E3", "C/E", "Am")).toBe("C3");
    // without a slash bass, `bass` changes nothing
    expect(fitNote("C3", "C7", "F7", { bass: true })).toBe("F3");
  });

  test("non-chord tones can keep their interval", () => {
    const line = ["C3", "Db3", "D3", "Eb3", "E3"];
    // fitted by role, the chromatic line collapses
    expect(line.map((n) => fitNote(n, "C7", "Fmaj7"))).toEqual([
      "F3",
      "G3",
      "G3",
      "G3",
      "A3",
    ]);
    // kept, the non-chord tones move with the root, spelled by their role
    // (Eb is the #9 of C7), and chord tones still fit
    const keep = { keep: "non-chord" } as const;
    expect(line.map((n) => fitNote(n, "C7", "Fmaj7", keep))).toEqual([
      "F3",
      "Gb3",
      "G3",
      "G#3",
      "A3",
    ]);
    expect(line.map((n) => fitNote(n, "C7", "Fm7", keep))).toEqual([
      "F3",
      "Gb3",
      "G3",
      "G#3",
      "Ab3",
    ]);
    // a chord tone of `from` is still fitted, with scale and bass
    expect(fitNote("Bb3", "C7", "Fmaj7", keep)).toBe("E4");
    expect(
      fitNote("C3", "C7", "F7/Eb", { keep: "non-chord", bass: true }),
    ).toBe("Eb3");
  });

  test("pitch classes give pitch classes", () => {
    expect(fitNote("E", "C7", "Am7")).toBe("C");
    expect(fitNote("Bb", "C7", "Fmaj7")).toBe("E");
  });

  test("equal chords give the same note", () => {
    for (const type of TYPES) {
      const chord = "C" + type;
      const notes = [...formula(chord), ...tensions(chord)].map(
        (d) => noteOf(chord, d) + "4",
      );
      for (const n of notes) {
        expect(note(fitNote(n, chord, chord)).height, `${n} on ${chord}`).toBe(
          note(n).height,
        );
      }
    }
  });

  test("the same type on another root is a transposition", () => {
    for (const type of TYPES) {
      const from = "C" + type;
      const degrees = [...formula(from), ...tensions(from)];
      for (const root of ROOTS) {
        const to = root + type;
        let motion = (note(root).chroma + 12) % 12;
        if (motion > 6) motion -= 12;
        for (const d of degrees) {
          const n = noteOf(from, d) + "4";
          const fitted = fitNote(n, from, to);
          expect(degreeOf(to, fitted), `${d} of ${from} to ${to}`).toBe(
            degreeOf(from, n),
          );
          expect(note(fitted).height).toBe(note(n).height + motion);
        }
      }
    }
  });

  test("every fitted note is a chord tone, a tension or a kept degree, near its place", () => {
    const chromatic = "C Db D Eb E F F# G Ab A Bb B".split(" ");
    for (const fromType of ["7", "maj7", "m7"]) {
      const from = "C" + fromType;
      for (const type of TYPES) {
        for (const root of ROOTS) {
          const to = root + type;
          const allowed = new Set(
            [...formula(to), ...tensions(to)].map(
              (d) => note(noteOf(to, d)).chroma,
            ),
          );
          let motion = note(root).chroma;
          if (motion > 6) motion -= 12;
          for (const pc of chromatic) {
            const n = pc + "4";
            const fitted = fitNote(n, from, to);
            const role = degreeOf(from, n);
            const kept = fitDegree(role, to) === role;
            expect(
              allowed.has(note(fitted).chroma) || kept,
              `${n} from ${from} to ${to}: ${fitted}`,
            ).toBe(true);
            const shift = note(fitted).height - (note(n).height + motion);
            expect(Math.abs(shift)).toBeLessThanOrEqual(6);
          }
        }
      }
    }
  });

  test("invalid input", () => {
    expect(fitNote("x", "C7", "F7")).toBe("");
    expect(fitNote("C4", "x", "F7")).toBe("");
    expect(fitNote("C4", "C7", "x")).toBe("");
    expect(fitNote("C4", "C7", "m7")).toBe("");
    expect(fitNote("C4", "C7", "F7", { scale: "F nope" })).toBe("");
  });
});
