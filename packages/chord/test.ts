import { describe, expect, it, test } from "vitest";
import * as Chord from "./index";

const $ = (str: string) => str.split(" ");

describe("tonal-chord", () => {
  test("tokenize", () => {
    expect(Chord.tokenize("Cmaj7")).toEqual(["C", "maj7", ""]);
    expect(Chord.tokenize("c7")).toEqual(["C", "7", ""]);
    expect(Chord.tokenize("maj7")).toEqual(["", "maj7", ""]);
    expect(Chord.tokenize("c#4 m7b5")).toEqual(["C#", "4m7b5", ""]);
    expect(Chord.tokenize("c#4m7b5")).toEqual(["C#", "4m7b5", ""]);
    expect(Chord.tokenize("Cb7b5")).toEqual(["Cb", "7b5", ""]);
    expect(Chord.tokenize("Eb7add6")).toEqual(["Eb", "7add6", ""]);
    expect(Chord.tokenize("Bb6b5")).toEqual(["Bb", "6b5", ""]);
    expect(Chord.tokenize("aug")).toEqual(["", "aug", ""]);
    expect(Chord.tokenize("C11")).toEqual(["C", "11", ""]);
    expect(Chord.tokenize("C13no5")).toEqual(["C", "13no5", ""]);
    expect(Chord.tokenize("C64")).toEqual(["C", "64", ""]);
    expect(Chord.tokenize("C9")).toEqual(["C", "9", ""]);
    // see: https://github.com/tonaljs/tonal/issues/70
    expect(Chord.tokenize("C5")).toEqual(["C", "5", ""]);
    expect(Chord.tokenize("C4")).toEqual(["C", "4", ""]);
    // https://github.com/tonaljs/tonal/issues/407
    expect(Chord.tokenize("C4|\n")).toEqual(["", "C4|\n", ""]);

    // With bass
    expect(Chord.tokenize("Cmaj7/G")).toEqual(["C", "maj7", "G"]);
    expect(Chord.tokenize("bb6/a##")).toEqual(["Bb", "6", "A##"]);
    expect(Chord.tokenize("bb6/a##5")).toEqual(["Bb", "6/a##5", ""]);
  });

  describe("getChord", () => {
    test("Chord properties", () => {
      expect(Chord.getChord("maj7", "G4", "G4")).toEqual({
        empty: false,
        name: "G major seventh",
        symbol: "Gmaj7",
        tonic: "G",
        root: "G",
        bass: "",
        rootDegree: 1,
        setNum: 2193,
        type: "major seventh",
        aliases: ["maj7", "Δ", "ma7", "M7", "Maj7", "^7"],
        chroma: "100010010001",
        intervals: ["1P", "3M", "5P", "7M"],
        normalized: "100010010001",
        notes: ["G", "B", "D", "F#"],
        quality: "Major",
      });
    });
    test("first inversion", () => {
      expect(Chord.getChord("maj7", "G4", "B4")).toEqual({
        empty: false,
        name: "G major seventh over B",
        symbol: "Gmaj7/B",
        tonic: "G",
        root: "B",
        bass: "B",
        rootDegree: 2,
        setNum: 2193,
        type: "major seventh",
        aliases: ["maj7", "Δ", "ma7", "M7", "Maj7", "^7"],
        chroma: "100010010001",
        intervals: ["3M", "5P", "7M", "8P"],
        normalized: "100010010001",
        notes: ["B", "D", "F#", "G"],
        quality: "Major",
      });
    });
    test("first inversion without octave", () => {
      expect(Chord.getChord("maj7", "G", "B")).toEqual({
        empty: false,
        name: "G major seventh over B",
        symbol: "Gmaj7/B",
        tonic: "G",
        root: "B",
        bass: "B",
        rootDegree: 2,
        setNum: 2193,
        type: "major seventh",
        aliases: ["maj7", "Δ", "ma7", "M7", "Maj7", "^7"],
        chroma: "100010010001",
        intervals: ["3M", "5P", "7M", "8P"],
        normalized: "100010010001",
        notes: ["B", "D", "F#", "G"],
        quality: "Major",
      });
    });
    test("second inversion", () => {
      expect(Chord.getChord("maj7", "G4", "D5")).toEqual({
        empty: false,
        name: "G major seventh over D",
        symbol: "Gmaj7/D",
        tonic: "G",
        root: "D",
        bass: "D",
        rootDegree: 3,
        setNum: 2193,
        type: "major seventh",
        aliases: ["maj7", "Δ", "ma7", "M7", "Maj7", "^7"],
        chroma: "100010010001",
        intervals: ["5P", "7M", "8P", "10M"],
        normalized: "100010010001",
        notes: ["D", "F#", "G", "B"],
        quality: "Major",
      });
    });
    test("without root", () => {
      expect(Chord.getChord("M7", "G")).toMatchObject({
        symbol: "GM7",
        name: "G major seventh",
        notes: ["G", "B", "D", "F#"],
      });
    });
    test("rootDegrees", () => {
      expect(Chord.getChord("maj7", "C", "C").rootDegree).toBe(1);
      expect(Chord.getChord("maj7", "C", "D").rootDegree).toBe(NaN);
    });
    test("without tonic nor root", () => {
      expect(Chord.getChord("dim")).toEqual({
        symbol: "dim",
        name: "diminished",
        tonic: "",
        root: "",
        bass: "",
        rootDegree: NaN,
        type: "diminished",
        aliases: ["dim", "°", "o"],
        chroma: "100100100000",
        empty: false,
        intervals: ["1P", "3m", "5d"],
        normalized: "100000100100",
        notes: [],
        quality: "Diminished",
        setNum: 2336,
      });
    });
  });

  test("chord", () => {
    expect(Chord.get("Cmaj7")).toEqual({
      empty: false,
      symbol: "Cmaj7",
      name: "C major seventh",
      tonic: "C",
      root: "",
      bass: "",
      rootDegree: NaN,
      setNum: 2193,
      type: "major seventh",
      aliases: ["maj7", "Δ", "ma7", "M7", "Maj7", "^7"],
      chroma: "100010010001",
      intervals: ["1P", "3M", "5P", "7M"],
      normalized: "100010010001",
      notes: ["C", "E", "G", "B"],
      quality: "Major",
    });
    expect(Chord.get("hello").empty).toBe(true);
    expect(Chord.get("").empty).toBe(true);
    expect(Chord.get("C").name).toEqual("C major");
    // Chord with bass, without root
    expect(Chord.chord("C/Bb")).toEqual({
      aliases: ["M", "^", "", "maj"],
      bass: "Bb",
      chroma: "100010010000",
      empty: false,
      intervals: ["-2M", "1P", "3M", "5P"],
      name: "C major over Bb",
      normalized: "100001000100",
      notes: ["Bb", "C", "E", "G"],
      quality: "Major",
      root: "",
      rootDegree: NaN,
      setNum: 2192,
      symbol: "C/Bb",
      tonic: "C",
      type: "major",
    });
  });

  test("chord without tonic", () => {
    expect(Chord.get("dim")).toMatchObject({ name: "diminished" });
    expect(Chord.get("dim7")).toMatchObject({ name: "diminished seventh" });
    expect(Chord.get("alt7")).toMatchObject({ name: "altered" });
  });

  test("notes property", () => {
    expect(Chord.get("Cmaj7").notes).toEqual(["C", "E", "G", "B"]);
    expect(Chord.get("Eb7add6").notes).toEqual(["Eb", "G", "Bb", "Db", "C"]);
    expect(Chord.get(["C4", "maj7"]).notes).toEqual(["C", "E", "G", "B"]);
    expect(Chord.get("C7").notes).toEqual(["C", "E", "G", "Bb"]);
    expect(Chord.get("Cmaj7#5").notes).toEqual(["C", "E", "G#", "B"]);
    expect(Chord.get("blah").notes).toEqual([]);
  });

  test("notes with two params", () => {
    expect(Chord.get(["C", "maj7"]).notes).toEqual(["C", "E", "G", "B"]);
    // see: https://github.com/danigb/tonal/issues/82
    expect(Chord.get(["C6", "maj7"]).notes).toEqual(["C", "E", "G", "B"]);
  });

  // see: https://github.com/danigb/tonal/issues/52
  test("augmented chords (issue #52)", () => {
    expect(Chord.get("Caug").notes).toEqual(["C", "E", "G#"]);
    expect(Chord.get(["C", "aug"]).notes).toEqual(["C", "E", "G#"]);
  });

  test("intervals", () => {
    expect(Chord.get("maj7").intervals).toEqual(["1P", "3M", "5P", "7M"]);
    expect(Chord.get("Cmaj7").intervals).toEqual(["1P", "3M", "5P", "7M"]);
    expect(Chord.get("aug").intervals).toEqual(["1P", "3M", "5A"]);
    expect(Chord.get("C13no5").intervals).toEqual([
      "1P",
      "3M",
      "7m",
      "9M",
      "13M",
    ]);
    expect(Chord.get("major").intervals).toEqual(["1P", "3M", "5P"]);
  });

  test("notes", () => {
    expect(Chord.notes("Cmaj7")).toEqual(["C", "E", "G", "B"]);
    expect(Chord.notes("maj7")).toEqual([]);
    expect(Chord.notes("maj7", "C4")).toEqual(["C4", "E4", "G4", "B4"]);
    expect(Chord.notes("Cmaj7", "C4")).toEqual(["C4", "E4", "G4", "B4"]);
    expect(Chord.notes("Cmaj7", "D4")).toEqual(["D4", "F#4", "A4", "C#5"]);
    expect(Chord.notes("C/Bb", "D4")).toEqual(["C4", "D4", "F#4", "A4"]);
  });

  test("existence", () => {
    expect(Chord.get("C6add9").name).toEqual("C sixth added ninth");
    expect(Chord.get("maj7").empty).toBe(false);
    expect(Chord.get("Cmaj7").empty).toBe(false);
    expect(Chord.get("mixolydian").empty).toBe(true);
  });

  test("chordScales", () => {
    const names =
      "phrygian dominant,flamenco,spanish heptatonic,half-whole diminished,chromatic";
    expect(Chord.chordScales("C7b9")).toEqual(names.split(","));
  });

  it("transpose chord names", () => {
    expect(Chord.transpose("Eb7b9", "5P")).toEqual("Bb7b9");
    expect(Chord.transpose("7b9", "5P")).toEqual("7b9");
    expect(Chord.transpose("Cmaj7/B", "P5")).toEqual("Gmaj7/F#");
  });

  test("extended", () => {
    const chords =
      "Cmaj#4 Cmaj7#9#11 Cmaj9 CM7add13 Cmaj13 Cmaj9#11 CM13#11 CM7b9";
    expect(Chord.extended("CMaj7").sort()).toEqual($(chords).sort());
  });

  test("reduced", () => {
    expect(Chord.reduced("CMaj7")).toEqual(["C5", "CM"]);
  });

  describe("Chord.degrees", () => {
    test("ascending", () => {
      expect([1, 2, 3, 4].map(Chord.degrees("C"))).toEqual(
        "C E G C".split(" "),
      );
      expect([1, 2, 3, 4].map(Chord.degrees("CM", "C4"))).toEqual(
        "C4 E4 G4 C5".split(" "),
      );
      expect(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(Chord.degrees("Cm6", "C4")),
      ).toEqual("C4 Eb4 G4 A4 C5 Eb5 G5 A5 C6 Eb6".split(" "));
      expect([1, 2, 3, 4].map(Chord.degrees("C/B"))).toEqual(
        "B C E G".split(" "),
      );
    });
    test("descending", () => {
      expect([-1, -2, -3].map(Chord.degrees("C"))).toEqual("G E C".split(" "));
      expect([-1, -2, -3].map(Chord.degrees("CM", "C4"))).toEqual(
        "G3 E3 C3".split(" "),
      );
    });
  });

  test("Chord.steps", () => {
    expect([-3, -2, -1, 0, 1, 2, 3].map(Chord.steps("aug", "C4"))).toEqual(
      "C3 E3 G#3 C4 E4 G#4 C5".split(" "),
    );
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
