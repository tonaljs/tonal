/* global describe test expect */
const Chord = require("./");

const $ = str => str.split(" ");

describe("tonal-chord", () => {
  test("tokenize", () => {
    expect(Chord.tokenize("Cmaj7")).toEqual(["C", "maj7"]);
    expect(Chord.tokenize("c7")).toEqual(["C", "7"]);
    expect(Chord.tokenize("maj7")).toEqual([null, "maj7"]);
    expect(Chord.tokenize("c#4 m7b5")).toEqual(["C#4", "m7b5"]);
    expect(Chord.tokenize("c#4m7b5")).toEqual(["C#4", "m7b5"]);
    expect(Chord.tokenize("Cb7b5")).toEqual(["Cb", "7b5"]);
    expect(Chord.tokenize("Eb7add6")).toEqual(["Eb", "7add6"]);
    expect(Chord.tokenize("Bb6b5")).toEqual(["Bb", "6b5"]);
    expect(Chord.tokenize("aug")).toEqual([null, "aug"]);
    expect(Chord.tokenize("C11")).toEqual(["C", "11"]);
    expect(Chord.tokenize("C13no5")).toEqual(["C", "13no5"]);
    expect(Chord.tokenize("C64")).toEqual(["C", "64"]);
  });

  test("notes", () => {
    expect(Chord.notes("Cmaj7")).toEqual(["C", "E", "G", "B"]);
    expect(Chord.notes("Eb7add6")).toEqual(["Eb", "G", "Bb", "Db", "C"]);
    expect(Chord.notes("C4 maj7")).toEqual(["C4", "E4", "G4", "B4"]);
    expect(Chord.notes("C7")).toEqual(["C", "E", "G", "Bb"]);
    expect(Chord.notes("Cmaj7#5")).toEqual(["C", "E", "G#", "B"]);
    expect(Chord.notes("blah")).toEqual([]);
  });

  test("notes with two params", () => {
    expect(Chord.notes("C", "maj7")).toEqual(["C", "E", "G", "B"]);
    // see: https://github.com/danigb/tonal/issues/82
    expect(Chord.notes("C6", "maj7")).toEqual(["C6", "E6", "G6", "B6"]);
  });

  // see: https://github.com/danigb/tonal/issues/52
  test("augmented chords (issue #52)", () => {
    expect(Chord.notes("Caug")).toEqual(["C", "E", "G#"]);
    expect(Chord.notes("C", "aug")).toEqual(["C", "E", "G#"]);
  });

  test("intervals", () => {
    expect(Chord.intervals("maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(Chord.intervals("Cmaj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(Chord.intervals("aug")).toEqual(["1P", "3M", "5A"]);
    expect(Chord.intervals("C13no5")).toEqual(["1P", "3M", "7m", "9M", "13M"]);
    expect(Chord.intervals("major")).toEqual(["1P", "3M", "5P"]);
    expect(Chord.intervals()).toEqual([]);
  });

  test("exists", () => {
    expect(Chord.exists("maj7")).toBe(true);
    expect(Chord.exists("Cmaj7")).toBe(true);
    expect(Chord.exists("mixolydian")).toBe(false);
  });

  test("supsersets", () => {
    expect(Chord.supersets("CMaj7")).toEqual(
      $("M7add13 Maj7#9#11 M7b9 maj#4 maj9#11 maj13 maj9 M13#11")
    );
  });

  test.skip("subset", () => {
    expect(Chord.subsets("CMaj7")).toEqual(["5", "64", "M"]);
  });

  test.skip("position", () => {
    expect(Chord.position("g2 c3 e4 b")).toEqual(2);
    expect(Chord.position("b e c g")).toEqual(3);
  });

  test.skip("inversion", () => {
    expect(Chord.inversion(1, "C4 maj7")).toEqual(["E", "G", "B", "C"]);
    expect(Chord.inversion(0, "e g c")).toEqual(["C", "E", "G"]);
    expect(Chord.inversion(1, "e g c")).toEqual(["E", "G", "C"]);
    expect(Chord.inversion(2, "e g c")).toEqual(["G", "C", "E"]);
    expect(Chord.inversion(0)("b g e d c")).toEqual(["C", "E", "G", "B", "D"]);
    expect(Chord.inversion(3, "CMaj7#5")).toEqual(["B", "C", "E", "G#"]);
    expect(Chord.inversion(1, "c d e")).toEqual([]);
  });
});
