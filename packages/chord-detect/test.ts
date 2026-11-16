import { describe, expect, test } from "vitest";
import { detect } from "./index";

describe("@tonal/chord-detect", () => {
  test("detect", () => {
    expect(detect(["D", "F#", "A", "C"])).toEqual(["D7"]);
    expect(detect(["F#", "A", "C", "D"])).toEqual(["D7/F#"]);
    expect(detect(["A", "C", "D", "F#"])).toEqual(["D7/A"]);
    expect(detect(["E", "G#", "B", "C#"])).toEqual(["E6", "C#m7/E"]);
  });

  test("assume perfect 5th", () => {
    expect(detect(["D", "F", "C"], { assumePerfectFifth: true })).toEqual([
      "Dm7",
    ]);
    expect(detect(["D", "F", "C"], { assumePerfectFifth: false })).toEqual([]);
    expect(detect(["D", "F", "A", "C"], { assumePerfectFifth: true })).toEqual([
      "Dm7",
      "F6/D",
    ]);
    expect(detect(["D", "F", "A", "C"], { assumePerfectFifth: false })).toEqual(
      ["Dm7", "F6/D"],
    );
    expect(detect(["D", "F", "Ab", "C"], { assumePerfectFifth: true })).toEqual(
      ["Dm7b5", "Fm6/D"],
    );
  });

  test("(regression) detect aug", () => {
    expect(detect(["C", "E", "G#"])).toEqual(["Caug", "Eaug/C", "G#aug/C"]);
  });

  test("the lowest note is the bass when every note has an octave", () => {
    const notes = ["F3", "A3", "C4"];
    const orders = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ];
    for (const order of orders) {
      expect(detect(order.map((i) => notes[i]))).toEqual(["FM", "Am#5/F"]);
    }
    expect(detect(["A3", "C4", "F3"])).toEqual(["FM", "Am#5/F"]);
    // without octaves (or with some missing), the first note is the bass
    expect(detect(["A", "C", "F"])).toEqual(["FM/A", "Am#5"]);
    expect(detect(["A3", "C4", "F"])).toEqual(["FM/A", "Am#5"]);
  });

  test("unusual readings go after inversions", () => {
    expect(detect(["E4", "G4", "C5"])).toEqual(["CM/E", "Em#5"]);
    expect(detect(["E", "G", "B", "C"])).toEqual(["Cmaj7/E", "Emb6"]);
    expect(detect(["C", "F", "Bb", "Eb"])).toEqual([
      "F7sus4/C",
      "Bbsus24/C",
      "Cquartal",
    ]);
    expect(detect(["C", "D", "G", "A"])).toEqual([
      "D7sus4/C",
      "Gsus24/C",
      "Aquartal/C",
    ]);
    expect(detect(["C", "Eb", "Gb", "A", "B"])).toEqual(["B7b9/C", "Co7M7"]);
    // dominant chords without fifth are usual
    expect(detect(["C", "E", "Bb", "D", "A"])[0]).toEqual("C13no5");
  });

  test("names that parse back", () => {
    expect(detect(["C", "F", "G", "Bb", "Db"])[0]).toEqual("C7b9sus4");
    expect(detect(["Eb", "G", "B", "C"])).toEqual(["CmMaj7/Eb"]);
  });

  test("the name that spells the notes goes first", () => {
    expect(detect(["Eb", "G", "B", "D"])[0]).toEqual("Ebmaj7#5");
    expect(detect(["Eb", "G", "Cb", "D"])[0]).toEqual("EbM7b6");
    expect(detect(["C", "E", "Ab", "Bb"])[0]).toEqual("C7b13");
    expect(detect(["C", "E", "G#", "Bb"])[0]).toEqual("C7#5");
  });

  test("exclude chord types", () => {
    expect(detect(["C", "F", "Bb", "Eb"], { exclude: ["quartal"] })).toEqual([
      "F7sus4/C",
      "Bbsus24/C",
    ]);
    expect(detect(["C", "F", "Bb", "Eb"], { exclude: ["4"] })).toEqual([
      "F7sus4/C",
      "Bbsus24/C",
    ]);
    expect(detect(["E", "G", "C"], { exclude: ["minor augmented"] })).toEqual([
      "CM/E",
    ]);
  });

  test("edge cases", () => {
    expect(detect([])).toEqual([]);
  });
});
