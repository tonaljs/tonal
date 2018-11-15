/* global describe test expect */
var chord = require("../index");

describe("tonal-chord", () => {
  test("tokenize", () => {
    expect(chord.tokenize("Cmaj7")).toEqual(["C", "maj7"]);
    expect(chord.tokenize("c7")).toEqual(["C", "7"]);
    expect(chord.tokenize("maj7")).toEqual(["", "maj7"]);
    expect(chord.tokenize("c#4 m7b5")).toEqual(["C#4", "m7b5"]);
    expect(chord.tokenize("c#4m7b5")).toEqual(["C#4", "m7b5"]);
    expect(chord.tokenize("Cb7b5")).toEqual(["Cb", "7b5"]);
    expect(chord.tokenize("Eb7add6")).toEqual(["Eb", "7add6"]);
    expect(chord.tokenize("Bb6b5")).toEqual(["Bb", "6b5"]);
    expect(chord.tokenize("aug")).toEqual(["", "aug"]);
    expect(chord.tokenize("C11")).toEqual(["C", "11"]);
    expect(chord.tokenize("C13no5")).toEqual(["C", "13no5"]);
  });

  test("notes", () => {
    expect(chord.notes("Cmaj7")).toEqual(["C", "E", "G", "B"]);
    expect(chord.notes("Eb7add6")).toEqual(["Eb", "G", "Bb", "Db", "C"]);
    expect(chord.notes("C4 maj7")).toEqual(["C4", "E4", "G4", "B4"]);
    expect(chord.notes("C7")).toEqual(["C", "E", "G", "Bb"]);
    expect(chord.notes("C64")).toEqual(["G", "C", "E"]);
    expect(chord.notes("Cmaj7#5")).toEqual(["C", "E", "G#", "B"]);
    expect(chord.notes("blah")).toEqual([]);
  });

  test("notes with two params", () => {
    expect(chord.notes("C", "maj7")).toEqual(["C", "E", "G", "B"]);
    // see: https://github.com/danigb/tonal/issues/82
    expect(chord.notes("C6", "maj7")).toEqual(["C6", "E6", "G6", "B6"]);
  });

  // see: https://github.com/danigb/tonal/issues/52
  test("augmented chords (issue #52)", () => {
    expect(chord.notes("Caug")).toEqual(["C", "E", "G#"]);
    expect(chord.notes("C", "aug")).toEqual(["C", "E", "G#"]);
  });

  test("intervals", () => {
    expect(chord.intervals("maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(chord.intervals("Cmaj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(chord.intervals("aug")).toEqual(["1P", "3M", "5A"]);
    expect(chord.intervals("C13no5")).toEqual(["1P", "3M", "7m", "9M", "13M"]);
    expect(chord.intervals("major")).toEqual([]);
    expect(chord.intervals()).toEqual([]);
  });

  test("exists", () => {
    expect(chord.exists("maj7")).toBe(true);
    expect(chord.exists("Cmaj7")).toBe(true);
    expect(chord.exists("major")).toBe(false);
  });

  test("supsersets", () => {
    expect(chord.supersets("CMaj7")).toEqual([
      "M13",
      "M13#11",
      "M7#11",
      "M7#9#11",
      "M7add13",
      "M7b9",
      "M9",
      "M9#11"
    ]);
  });

  test("subset", () => {
    expect(chord.subsets("CMaj7")).toEqual(["5", "64", "M"]);
  });

  test.skip("position", () => {
    expect(chord.position("g2 c3 e4 b")).toEqual(2);
    expect(chord.position("b e c g")).toEqual(3);
  });

  test.skip("inversion", () => {
    expect(chord.inversion(1, "C4 maj7")).toEqual(["E", "G", "B", "C"]);
    expect(chord.inversion(0, "e g c")).toEqual(["C", "E", "G"]);
    expect(chord.inversion(1, "e g c")).toEqual(["E", "G", "C"]);
    expect(chord.inversion(2, "e g c")).toEqual(["G", "C", "E"]);
    expect(chord.inversion(0)("b g e d c")).toEqual(["C", "E", "G", "B", "D"]);
    expect(chord.inversion(3, "CMaj7#5")).toEqual(["B", "C", "E", "G#"]);
    expect(chord.inversion(1, "c d e")).toEqual([]);
  });

  test("names", () => {
    expect(chord.names("100010010001")).toEqual(["Maj7", "maj7", "M7"]);
    expect(chord.names().length).toBeGreaterThan(0);
    expect(chord.names(true).length).toBeGreaterThan(chord.names().length);
  });
});
