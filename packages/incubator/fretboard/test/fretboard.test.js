/* global describe test expect */

var fr = require("..");

describe("tonal-fretboard", () => {
  test("names", () => {
    expect(fr.names(true).length > fr.names(false).length).toBeTruthy();
  });

  test("tuning", () => {
    expect(fr.tuning("guitar")).toEqual(["E2", "A2", "D3", "G3", "B3", "E4"]);
    expect(fr.tuning("charango")).toEqual([
      "G4",
      "G4",
      "C5",
      "C5",
      "E5",
      "E4",
      "A4",
      "A4",
      "E5",
      "E5"
    ]);
  });

  test("simple tuning", () => {
    expect(fr.simpleTuning("guitar")).toEqual(["E", "A", "D", "G", "B", "E"]);
    expect(fr.simpleTuning("charango")).toEqual(["G", "C", "E", "A", "E"]);
  });

  test("notes", () => {
    expect(fr.notes("E2 A2 D3", 0, 2)).toEqual([
      ["E2", "F2", "F#2"],
      ["A2", "Bb2", "B2"],
      ["D3", "Eb3", "E3"]
    ]);
    expect(fr.notes("guitar", 5, 7)).toEqual([
      ["A2", "Bb2", "B2"],
      ["D3", "Eb3", "E3"],
      ["G3", "Ab3", "A3"],
      ["C4", "Db4", "D4"],
      ["E4", "F4", "F#4"],
      ["A4", "Bb4", "B4"]
    ]);
  });

  test("scale", () => {
    expect(fr.scale("guitar", "C E G", 0, 5)).toEqual([
      ["E2", null, null, "G2", null, null],
      [null, null, null, "C3", null, null],
      [null, null, "E3", null, null, "G3"],
      ["G3", null, null, null, null, "C4"],
      [null, "C4", null, null, null, "E4"],
      ["E4", null, null, "G4", null, null]
    ]);
  });

  test("chordShapes", () => {
    expect(fr.chordShapes("guitar", [], 0, 5, 3)).toEqual([]);
    expect(fr.chordShapes("guitar", ["G"], 0, 5, 3)).toEqual([
      ["3", null, null, null, null, "3"],
      ["3", null, "5", null, null, "3"]
    ]);

    expect(fr.chordShapes("guitar", ["E", "G#", "B"], 0, 5, 3)).toEqual([
      ["0", "2", "2", "1", "0", "0"],
      [null, "2", "2", "1", null, null],
      ["4", "2", "2", "4", null, "4"],
      ["4", null, null, "4", "5", "4"]
    ]);
  });
});
