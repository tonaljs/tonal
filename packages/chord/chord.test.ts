import {
  chord,
  chordScales,
  extended,
  reduced,
  tokenize,
  transpose
} from "./index";

const $ = (str: string) => str.split(" ");

describe("tonal-chord", () => {
  test("tokenize", () => {
    expect(tokenize("Cmaj7")).toEqual(["C", "maj7"]);
    expect(tokenize("c7")).toEqual(["C", "7"]);
    expect(tokenize("maj7")).toEqual(["", "maj7"]);
    expect(tokenize("c#4 m7b5")).toEqual(["C#4", "m7b5"]);
    expect(tokenize("c#4m7b5")).toEqual(["C#4", "m7b5"]);
    expect(tokenize("Cb7b5")).toEqual(["Cb", "7b5"]);
    expect(tokenize("Eb7add6")).toEqual(["Eb", "7add6"]);
    expect(tokenize("Bb6b5")).toEqual(["Bb", "6b5"]);
    expect(tokenize("aug")).toEqual(["", "aug"]);
    expect(tokenize("C11")).toEqual(["C", "11"]);
    expect(tokenize("C13no5")).toEqual(["C", "13no5"]);
    expect(tokenize("C64")).toEqual(["C", "64"]);
    // see: https://github.com/tonaljs/tonal/issues/70
    expect(tokenize("C5")).toEqual(["C", "5"]);
    expect(tokenize("C4")).toEqual(["C", "4"]);
  });

  test("chord", () => {
    expect(chord("Cmaj7")).toEqual({
      empty: false,
      name: "C major seventh",
      tonic: "C",
      setNum: 2193,
      type: "major seventh",
      aliases: ["maj7", "Δ", "ma7", "M7", "Maj7"],
      chroma: "100010010001",
      intervals: ["1P", "3M", "5P", "7M"],
      normalized: "100010010001",
      notes: ["C", "E", "G", "B"],
      quality: "Major"
    });
    expect(chord("hello").empty).toBe(true);
    expect(chord("").empty).toBe(true);
    expect(chord("C")).toEqual(chord("C major"));
  });

  test("notes", () => {
    expect(chord("Cmaj7").notes).toEqual(["C", "E", "G", "B"]);
    expect(chord("Eb7add6").notes).toEqual(["Eb", "G", "Bb", "Db", "C"]);
    expect(chord("C4 maj7").notes).toEqual(["C4", "E4", "G4", "B4"]);
    expect(chord("C7").notes).toEqual(["C", "E", "G", "Bb"]);
    expect(chord("Cmaj7#5").notes).toEqual(["C", "E", "G#", "B"]);
    expect(chord("blah").notes).toEqual([]);
  });

  test("notes with two params", () => {
    expect(chord(["C", "maj7"]).notes).toEqual(["C", "E", "G", "B"]);
    // see: https://github.com/danigb/tonal/issues/82
    expect(chord(["C6", "maj7"]).notes).toEqual(["C6", "E6", "G6", "B6"]);
  });

  // see: https://github.com/danigb/tonal/issues/52
  test("augmented chords (issue #52)", () => {
    expect(chord("Caug").notes).toEqual(["C", "E", "G#"]);
    expect(chord(["C", "aug"]).notes).toEqual(["C", "E", "G#"]);
  });

  test("intervals", () => {
    expect(chord("maj7").intervals).toEqual(["1P", "3M", "5P", "7M"]);
    expect(chord("Cmaj7").intervals).toEqual(["1P", "3M", "5P", "7M"]);
    expect(chord("aug").intervals).toEqual(["1P", "3M", "5A"]);
    expect(chord("C13no5").intervals).toEqual(["1P", "3M", "7m", "9M", "13M"]);
    expect(chord("major").intervals).toEqual(["1P", "3M", "5P"]);
  });

  test("exists", () => {
    expect(!chord("maj7").empty).toBe(true);
    expect(!chord("Cmaj7").empty).toBe(true);
    expect(!chord("mixolydian").empty).toBe(false);
  });

  test("chordScales", () => {
    const names =
      "phrygian dominant,flamenco,spanish heptatonic,half-whole diminished,chromatic";
    expect(chordScales("C7b9")).toEqual(names.split(","));
  });

  it("transpose chord names", () => {
    expect(transpose("Eb7b9", "5P")).toEqual("Bb7b9");
  });

  test("extended", () => {
    const chords =
      "Cmaj#4 Cmaj7#9#11 Cmaj9 CM7add13 Cmaj13 Cmaj9#11 CM13#11 CM7b9";
    expect(extended("CMaj7").sort()).toEqual($(chords).sort());
  });

  test("reduced", () => {
    expect(reduced("CMaj7")).toEqual(["C5", "CM"]);
  });

  /*
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
  */
});
