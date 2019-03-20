import Fretboard from ".";

const $ = str => str.split(" ");

describe("Fretboard", () => {
  test("names", () => {
    expect(Fretboard.tuningNames().length).toBe(5);
  });

  test("tuning", () => {
    expect(Fretboard.tuning("guitar")).toEqual($("E2 A2 D3 G3 B3 E4"));
    expect(Fretboard.tuning("charango")).toEqual(
      $("G4 G4 C5 C5 E5 E4 A4 A4 E5 E5")
    );
  });

  test("simple tuning", () => {
    expect(Fretboard.simpleTuning("guitar")).toEqual($("E A D G B E"));
    expect(Fretboard.simpleTuning("charango")).toEqual($("G C E A E"));
  });

  test("notes", () => {
    expect(Fretboard.notes($("E2 A2 D3"), 0, 2)).toEqual([
      ["E2", "F2", "F#2"],
      ["A2", "Bb2", "B2"],
      ["D3", "Eb3", "E3"]
    ]);
    expect(Fretboard.notes("guitar", 5, 7)).toEqual([
      ["A2", "Bb2", "B2"],
      ["D3", "Eb3", "E3"],
      ["G3", "Ab3", "A3"],
      ["C4", "Db4", "D4"],
      ["E4", "F4", "F#4"],
      ["A4", "Bb4", "B4"]
    ]);
  });

  test("scale", () => {
    expect(Fretboard.scale("guitar", $("C E G"), 0, 5)).toEqual([
      ["E2", null, null, "G2", null, null],
      [null, null, null, "C3", null, null],
      [null, null, "E3", null, null, "G3"],
      ["G3", null, null, null, null, "C4"],
      [null, "C4", null, null, null, "E4"],
      ["E4", null, null, "G4", null, null]
    ]);
  });

  test("chordShapes", () => {
    expect(Fretboard.chordShapes("guitar", [], 0, 5, 3)).toEqual([]);
    expect(Fretboard.chordShapes("guitar", ["G"], 0, 5, 3)).toEqual([
      ["3", null, null, null, null, "3"],
      ["3", null, "5", null, null, "3"]
    ]);

    expect(Fretboard.chordShapes("guitar", ["E", "G#", "B"], 0, 5, 3)).toEqual([
      ["0", "2", "2", "1", "0", "0"],
      [null, "2", "2", "1", null, null],
      ["4", "2", "2", "4", null, "4"],
      ["4", null, null, "4", "5", "4"]
    ]);
  });
});
