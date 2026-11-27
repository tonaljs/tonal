import { describe, expect, test } from "vitest";
import * as Chord from "@tonaljs/chord";
import { note } from "@tonaljs/pitch-note";
import * as Scale from "./index";

const midi = (name: string) => note(name).midi;

describe("approaches", () => {
  test("every kind, for a target in the scale", () => {
    expect(Scale.approaches("G mixolydian", "G2")).toEqual({
      below: "F#2",
      above: "Ab2",
      scaleBelow: "F2",
      scaleAbove: "A2",
      dominantBelow: "D2",
      dominantAbove: "D3",
      enclosure: ["A2", "F#2"],
      chromaticEnclosure: ["Ab2", "F#2"],
      doubleBelow: ["F2", "F#2"],
      doubleAbove: ["A2", "Ab2"],
    });
  });

  test("a target not in the scale", () => {
    const a = Scale.approaches("C major", "F#2");
    expect([a.scaleBelow, a.scaleAbove]).toEqual(["F2", "G2"]);
    expect(Scale.approaches("C major pentatonic", "F2").scaleBelow).toEqual(
      "E2",
    );
    expect(Scale.approaches("C major pentatonic", "F2").scaleAbove).toEqual(
      "G2",
    );
  });

  test("spelling: the leading tone below, double accidentals respelled", () => {
    expect(Scale.approaches("", "F#2").below).toEqual("E#2");
    expect(Scale.approaches("", "Eb2").above).toEqual("E2");
    expect(Scale.approaches("", "Bb1").above).toEqual("B1");
    expect(Scale.approaches("", "B1").above).toEqual("C2");
    expect(Scale.approaches("", "Ab2").doubleAbove).toEqual(["Bb2", "A2"]);
    expect(Scale.approaches("", "Bb2").doubleAbove).toEqual(["C3", "B2"]);
    expect(Scale.approaches("", "Cb3").below).toEqual("Bb2");
    expect(Scale.approaches("", "B2").doubleAbove).toEqual(["C#3", "C3"]);
    expect(Scale.approaches("", "Fb2").below).toEqual("Eb2");
    expect(Scale.approaches("", "E#2").above).toEqual("F#2");
    // the scale notes are spelled as in the scale
    expect(Scale.approaches("Db major", "C3").scaleAbove).toEqual("Db3");
  });

  test("each note is next to the target, on the right side", () => {
    const scales = [
      "C major",
      "Eb melodic minor",
      "F# altered",
      "Bb diminished",
    ];
    const targets = ["C2", "F#2", "Bb2", "E3", "Ab3", "B1"];
    for (const scale of scales) {
      for (const target of targets) {
        const a = Scale.approaches(scale, target);
        const t = midi(target)!;
        const at = (name: string) => midi(name)! - t;
        expect(at(a.below)).toBe(-1);
        expect(at(a.above)).toBe(1);
        expect(at(a.dominantBelow)).toBe(-5);
        expect(at(a.dominantAbove)).toBe(7);
        expect(a.doubleBelow.map(at)).toEqual([-2, -1]);
        expect(a.doubleAbove.map(at)).toEqual([2, 1]);
        expect(at(a.scaleBelow)).toBeLessThan(0);
        expect(at(a.scaleAbove)).toBeGreaterThan(0);
        expect(at(a.scaleBelow)).toBeGreaterThanOrEqual(-4);
        expect(at(a.scaleAbove)).toBeLessThanOrEqual(4);
      }
    }
  });

  test("with the chord scale in a key", () => {
    const scale = Chord.chordScale("G7", { key: "C major" });
    expect(Scale.approaches(scale, "G2").scaleBelow).toEqual("F2");
    const toE = Chord.chordScale("E7", { key: "C major" });
    expect(Scale.approaches(toE, "E2").scaleBelow).toEqual("D2");
    expect(Scale.approaches(toE, "E2").scaleAbove).toEqual("F2");
  });

  test("invalid input", () => {
    const empty = {
      below: "",
      above: "",
      scaleBelow: "",
      scaleAbove: "",
      dominantBelow: "",
      dominantAbove: "",
      enclosure: [],
      chromaticEnclosure: [],
      doubleBelow: [],
      doubleAbove: [],
    };
    expect(Scale.approaches("C major", "G")).toEqual(empty);
    expect(Scale.approaches("C major", "nonsense")).toEqual(empty);
    const noScale = Scale.approaches("nonsense", "G2");
    expect([noScale.scaleBelow, noScale.scaleAbove, noScale.enclosure]).toEqual(
      ["", "", []],
    );
    expect(noScale.below).toEqual("F#2");
    expect(Scale.approaches("major", "G2").scaleBelow).toEqual("");
  });
});
