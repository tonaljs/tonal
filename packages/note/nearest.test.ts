import { describe, expect, test } from "vitest";
import * as Note from "./index";

const height = (name: string) => Note.get(name).height;
const PCS = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B Cb B# E# Fb".split(
  " ",
);

describe("nearest", () => {
  test("the nearest octave", () => {
    expect(Note.nearest("Eb", "C3")).toEqual("Eb3");
    expect(Note.nearest("A", "C3")).toEqual("A2");
    expect(Note.nearest("C", "C3")).toEqual("C3");
    // a tritone either way goes up
    expect(Note.nearest("F#", "C3")).toEqual("F#3");
    expect(Note.nearest("Gb", "C3")).toEqual("Gb3");
  });

  test("up and down are strict", () => {
    expect(Note.nearest("A", "C3", { direction: "up" })).toEqual("A3");
    expect(Note.nearest("E", "C3", { direction: "down" })).toEqual("E2");
    expect(Note.nearest("C", "C3", { direction: "up" })).toEqual("C4");
    expect(Note.nearest("C", "C3", { direction: "down" })).toEqual("C2");
  });

  test("the spelling is kept, only the pitch class counts", () => {
    expect(Note.nearest("Eb4", "C3")).toEqual("Eb3");
    expect(Note.nearest("D#", "C3")).toEqual("D#3");
    expect(Note.nearest("Cb", "C3")).toEqual("Cb3");
    expect(Note.nearest("B#", "C3")).toEqual("B#2");
    expect(Note.nearest("Fx", "E3")).toEqual("F##3");
  });

  test("a range", () => {
    expect(Note.nearest("G", "F1", { range: ["E1", "G3"] })).toEqual("G1");
    // no D below F1 in the range: the nearest in the range
    expect(
      Note.nearest("D", "F1", { range: ["E1", "G3"], direction: "down" }),
    ).toEqual("D2");
    expect(
      Note.nearest("A", "F3", { range: ["E1", "G3"], direction: "up" }),
    ).toEqual("A2");
    expect(Note.nearest("E", "C3", { range: ["E5", "G6"] })).toEqual("E5");
    // ends included
    expect(Note.nearest("E", "F1", { range: ["E1", "G3"] })).toEqual("E1");
    // no octave of the note in the range
    expect(Note.nearest("C", "C3", { range: ["D3", "E3"] })).toEqual("");
  });

  test("a line, each note near the one before", () => {
    const line = ["E", "G", "B", "D", "F", "A"].reduce(
      (notes, pc) => [...notes, Note.nearest(pc, notes[notes.length - 1])],
      ["C3"],
    );
    expect(line).toEqual(["C3", "E3", "G3", "B3", "D4", "F4", "A4"]);
  });

  test("every pitch class from every reference", () => {
    const refs = ["C3", "C#3", "Eb3", "F#3", "G3", "B2", "Cb3", "B#2", "A1"];
    for (const ref of refs) {
      const r = height(ref);
      for (const pc of PCS) {
        const near = Note.nearest(pc, ref);
        const up = Note.nearest(pc, ref, { direction: "up" });
        const down = Note.nearest(pc, ref, { direction: "down" });
        for (const result of [near, up, down]) {
          expect(Note.pitchClass(result)).toEqual(Note.pitchClass(pc));
        }
        const d = height(near) - r;
        expect(d).toBeGreaterThan(-6);
        expect(d).toBeLessThanOrEqual(6);
        expect(height(up) - r).toBeGreaterThanOrEqual(1);
        expect(height(up) - r).toBeLessThanOrEqual(12);
        expect(r - height(down)).toBeGreaterThanOrEqual(1);
        expect(r - height(down)).toBeLessThanOrEqual(12);
      }
    }
  });

  test("invalid input", () => {
    expect(Note.nearest("X", "C3")).toEqual("");
    expect(Note.nearest("C", "C")).toEqual("");
    expect(Note.nearest("C", "X")).toEqual("");
    expect(Note.nearest("C", "C3", { range: ["C4", "C3"] })).toEqual("");
    expect(Note.nearest("C", "C3", { range: ["C", "C4"] })).toEqual("");
    expect(
      Note.nearest("C", "C3", {
        direction: "sideways" as "up",
      }),
    ).toEqual("");
  });
});
