import { describe, expect, it, test } from "vitest";
import * as ChordType from "@tonaljs/chord-type";
import { note } from "@tonaljs/pitch-note";
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
        family: "major",
        complexity: 1,
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
        family: "major",
        complexity: 1,
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
        family: "major",
        complexity: 1,
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
        family: "major",
        complexity: 1,
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
        family: "diminished",
        complexity: 0,
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
      family: "major",
      complexity: 1,
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
      family: "major",
      complexity: 0,
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
      "Cmaj#4 Cmaj7#9 Cmaj7#9#11 Cmaj9 Cmaj11 CM7add13 Cmaj13 Cmaj9#11 CM13#11 CM7b9";
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
    // tonic with octave in chord tokens
    expect([-3, -2, -1, 0, 1, 2, 3].map(Chord.steps(["C4", "aug"]))).toEqual(
      "C3 E3 G#3 C4 E4 G#4 C5".split(" "),
    );
    expect([1, 2, 3, 4].map(Chord.degrees(["C4", "M"]))).toEqual(
      "C4 E4 G4 C5".split(" "),
    );
  });

  test("seventh augmented fifth and major eleventh", () => {
    expect(Chord.get("Caug7").type).toEqual("seventh augmented fifth");
    expect(Chord.get("Cmaj11").notes).toEqual(["C", "E", "G", "B", "D", "F"]);
    expect(Chord.get("CM11").type).toEqual("major eleventh");
  });

  describe("chord symbols as written in charts", () => {
    const notes = (symbol: string) => Chord.get(symbol).notes.join(" ");

    test("chart qualities", () => {
      const qualities =
        "+ - -11 -13 -6 -69 -7 -7b6 -9b6 -9 -add2 -add4 -^11 -^13 -^7 -^9 -b6 -#5 13 13#11 13#9 13b9 13sus sus2 5 6 69 7 7#11 7#5 7#9 7#9#11 7#9#5 7add13 7alt 7susb9b13 7b9 7b9#11 7b9#9 7b9b13 7susb9 7sus 7susadd3 9 9#11 9#5 9sus ^13 ^13#11 ^7 ^7#11 ^7#9 ^7b5 ^7#5 ^9 ^9#11 add2 add4 h7 h9 maj o o7 o^7 sus4";
      const unknown = $(qualities).filter((q) => Chord.get("C" + q).empty);
      expect(unknown).toEqual([]);
    });

    test("minor, major seventh and half-diminished qualities", () => {
      expect(notes("C-7b6")).toEqual("C Eb G Ab Bb");
      expect(notes("C-9b6")).toEqual("C Eb G Ab Bb D");
      expect(notes("C-^11")).toEqual("C Eb G B D F");
      expect(notes("C-^13")).toEqual("C Eb G B D A");
      expect(notes("C-add2")).toEqual("C Eb G D");
      expect(notes("C-add4")).toEqual("C Eb F G");
      expect(notes("C-b6")).toEqual("C Eb G Ab");
      expect(notes("C7susadd3")).toEqual("C E F G Bb");
      expect(notes("C7susb9")).toEqual("C F G Bb Db");
      expect(notes("C7susb9b13")).toEqual("C F G Bb Db Ab");
      expect(notes("C^13#11")).toEqual("C E G B D F# A");
      expect(notes("C^7#9")).toEqual("C E G B D#");
      expect(notes("C^7b5")).toEqual("C E Gb B");
      expect(notes("Cadd4")).toEqual("C E F G");
      expect(notes("Ch9")).toEqual("C Eb Gb Bb D");
      expect(notes("Co^7")).toEqual("C Eb Gb B");
    });

    test("a b5 lowers the fifth, a #11 keeps it", () => {
      expect(notes("C7b5b9")).toEqual("C E Gb Bb Db");
      expect(notes("C7b9b5")).toEqual("C E Gb Bb Db");
      expect(notes("C7b9#11")).toEqual("C E G Bb Db F#");
      expect(notes("C7b5#9")).toEqual("C E Gb Bb D#");
      expect(notes("C7#9b5")).toEqual("C E Gb Bb D#");
      expect(notes("C7#9#11")).toEqual("C E G Bb D# F#");
      expect(notes("C7b5b13")).toEqual("C E Gb Bb Ab");
      expect(notes("C9b5b13")).toEqual("C E Gb Bb D Ab");
      expect(notes("C7b5b9b13")).toEqual("C E Gb Bb Db Ab");
      expect(notes("C6b5")).toEqual("C E Gb A");
      expect(notes("CM6b5")).toEqual("C E Gb A");
      expect(notes("C6#11")).toEqual("C E G A F#");
    });

    test("alteration tokens after a listed type", () => {
      expect(notes("Cm7b5b9")).toEqual("C Eb Gb Bb Db");
      expect(notes("Cm11b5")).toEqual("C Eb Gb Bb D F");
      expect(notes("C7b9#9#11b13")).toEqual("C E G Bb Db D# F# Ab");
      expect(notes("Cmaj7b9")).toEqual("C E G B Db");
      expect(notes("C7sus4b9")).toEqual("C F G Bb Db");
      expect(notes("C7+5")).toEqual("C E G# Bb");
      expect(notes("C9#4")).toEqual("C E G Bb D F#");
      expect(notes("Cmb6")).toEqual("C Eb G Ab");
      expect(notes("Cmaddb9")).toEqual("C Eb G Db");
      expect(notes("C7add11")).toEqual("C E G Bb F");
    });

    test("an altered tone replaces the natural one", () => {
      expect(notes("C13b9")).toEqual("C E G Bb Db A");
      expect(notes("C9b9")).toEqual("C E G Bb Db");
      expect(notes("C9#9")).toEqual("C E G Bb D#");
      expect(notes("Cm11#11")).toEqual("C Eb G Bb D F#");
      expect(notes("C13b13")).toEqual("C E G Bb D Ab");
      expect(notes("Cmb5")).toEqual("C Eb Gb");
      expect(notes("C7#5b9")).toEqual("C E G# Bb Db");
      // b13 and b6 keep the fifth
      expect(notes("Cm9b13")).toEqual("C Eb G Bb D Ab");
    });

    test("tokens in parentheses", () => {
      expect(notes("C7(b9,#9)")).toEqual("C E G Bb Db D#");
      expect(notes("C7(b9, #9)")).toEqual("C E G Bb Db D#");
      expect(notes("C7(b9 #9)")).toEqual("C E G Bb Db D#");
      expect(notes("C7(b9#9)")).toEqual("C E G Bb Db D#");
      expect(notes("C7(b9)(#11)")).toEqual("C E G Bb Db F#");
      expect(notes("Cmaj7 (#11)")).toEqual("C E G B F#");
      expect(notes("C7(9,13)")).toEqual("C E G Bb D A");
      expect(notes("Cm7(11)")).toEqual("C Eb G Bb F");
      expect(notes("C7(13)")).toEqual("C E G Bb A");
      expect(notes("C6(9)")).toEqual("C E G A D");
    });

    test("a symbol without base is a major triad", () => {
      expect(notes("C(add9)")).toEqual("C E G D");
      expect(notes("C(b5)")).toEqual("C E Gb");
      expect(notes("C(#5)")).toEqual("C E G#");
      expect(notes("C(no3)")).toEqual("C G");
      expect(notes("C(maj7)")).toEqual("C E G B");
    });

    test("omissions", () => {
      expect(notes("C7(no3)")).toEqual("C G Bb");
      expect(notes("Cmaj7(no3)")).toEqual("C G B");
      expect(notes("C9(no5)")).toEqual("C E Bb D");
      expect(notes("Cm7no5")).toEqual("C Eb Bb");
      expect(notes("C7#5no3")).toEqual("C G# Bb");
    });

    test("suspensions replace the third", () => {
      expect(notes("Cmaj7sus4")).toEqual("C F G B");
      expect(notes("Cmaj9sus4")).toEqual("C F G B D");
      expect(notes("Cmaj7sus2")).toEqual("C D G B");
      expect(notes("CM7sus2")).toEqual("C D G B");
      expect(notes("C7sus2")).toEqual("C D G Bb");
      expect(notes("C9sus2")).toEqual("C D G Bb D");
      expect(notes("C6sus4")).toEqual("C F G A");
      expect(notes("C6sus2")).toEqual("C D G A");
      expect(notes("Cmaj7sus")).toEqual("C F G B");
      expect(notes("C7(sus4)")).toEqual("C F G Bb");
      expect(notes("C7sus2b9")).toEqual("C D G Bb Db");
      expect(notes("Ebmaj7sus2/Bb")).toEqual("Bb D Eb F");
      // the minor third is replaced too: the same chord as C7sus4
      expect(notes("Cm7sus4")).toEqual("C F G Bb");
      expect(Chord.get("Cm7sus4").intervals).toEqual(
        Chord.get("C7sus4").intervals,
      );
    });

    test("suspensions name listed types", () => {
      expect(Chord.get("Cmaj7sus4").aliases).toEqual(
        ChordType.get("M7sus4").aliases,
      );
      expect(Chord.get("Cmaj7sus4").symbol).toEqual("Cmaj7sus4");
      expect(Chord.get("Cmaj7sus4").name).toEqual("Cmaj7sus4");
      expect(Chord.get("C7sus2").type).toEqual("");
      expect(Chord.get("C7sus2").quality).toEqual("Unknown");
    });

    test("invalid suspensions", () => {
      for (const symbol of ["C7addsus4", "C7sus3", "C7sus9", "Cmaj7sus5"]) {
        expect(Chord.get(symbol).empty).toBe(true);
      }
    });

    test("major seventh token", () => {
      expect(notes("Cdim(maj7)")).toEqual("C Eb Gb B");
      expect(notes("Cm(maj7)")).toEqual("C Eb G B");
      expect(notes("Caug(maj7)")).toEqual("C E G# B");
      expect(notes("Cm9(^7)")).toEqual("C Eb G B D");
      expect(notes("Cdim7(maj7)")).toEqual("C Eb Gb B");
      expect(notes("C7(maj7)")).toEqual("C E G B");
      expect(notes("Cmaj7sus4")).toEqual("C F G B");
      expect(notes("C6maj7")).toEqual("C E G A B");
    });

    test("a bare major seventh token can't replace a seventh", () => {
      // "C4maj7" is an octave written inside a chord name, not quartal + maj7
      for (const symbol of ["C7maj7", "C4maj7", "Cm7maj7", "C7^7", "C7M7"]) {
        expect(Chord.get(symbol).empty).toBe(true);
      }
    });

    test("tokens can't double an interval", () => {
      for (const symbol of [
        "Cmaj7maj7",
        "Cmaj7(maj7)",
        "Csus4sus4",
        "Csus2sus2",
        "C7sus4sus4",
      ]) {
        expect(Chord.get(symbol).empty).toBe(true);
      }
      expect(notes("Csus2sus4")).toEqual("C D F G");
    });

    test("composed chord properties", () => {
      expect(Chord.get("Cm7b5b9")).toEqual({
        empty: false,
        name: "Cm7b5b9",
        symbol: "Cm7b5b9",
        tonic: "C",
        type: "",
        root: "",
        bass: "",
        rootDegree: NaN,
        setNum: 3362,
        chroma: "110100100010",
        normalized: "100010110100",
        quality: "Diminished",
        family: "half-diminished",
        complexity: 4,
        aliases: [],
        intervals: ["1P", "3m", "5d", "7m", "9m"],
        notes: ["C", "Eb", "Gb", "Bb", "Db"],
      });
      expect(Chord.get("m7b5b9")).toMatchObject({
        empty: false,
        tonic: "",
        symbol: "m7b5b9",
        intervals: ["1P", "3m", "5d", "7m", "9m"],
        notes: [],
      });
      expect(Chord.get("C7(no3)").quality).toEqual("Unknown");
      expect(Chord.get("C7b9#9#11b13").quality).toEqual("Major");
    });

    test("a composed listed type keeps the symbol as written", () => {
      expect(Chord.get("Cm(maj7)")).toMatchObject({
        symbol: "Cm(maj7)",
        type: "minor/major seventh",
        aliases: Chord.get("CmMaj7").aliases,
        intervals: ["1P", "3m", "5P", "7M"],
      });
      expect(Chord.get("C7(9,13)")).toMatchObject({
        symbol: "C7(9,13)",
        type: "dominant thirteenth",
      });
      expect(Chord.get("C7(b9,#9)").symbol).toEqual("C7(b9,#9)");
    });

    test("composed chords with bass", () => {
      expect(Chord.get("C7(b9,#9)/E")).toMatchObject({
        symbol: "C7(b9,#9)/E",
        bass: "E",
        root: "E",
        rootDegree: 2,
        notes: ["E", "G", "Bb", "Db", "D#", "C"],
      });
      expect(Chord.get("Cm7b5b9/D")).toMatchObject({
        symbol: "Cm7b5b9/D",
        bass: "D",
        root: "",
        notes: ["D", "C", "Eb", "Gb", "Bb", "Db"],
      });
    });

    test("composed chords work with the rest of the module", () => {
      expect(Chord.transpose("C7(b9,#9)", "P5")).toEqual("G7(b9,#9)");
      expect(Chord.notes("m7b5b9", "D4")).toEqual($("D4 F4 Ab4 C5 Eb5"));
      expect(Chord.getChord("m7b5b9", "D").notes).toEqual($("D F Ab C Eb"));
      expect(Chord.get(["D", "7(no3)"]).notes).toEqual($("D A C"));
      expect(Chord.degrees("7(no3)", "C4")(3)).toEqual("Bb4");
      expect(Chord.chordScales("Cm7b5b9")).toContain("locrian");
    });

    test("symbols that aren't a base plus tokens", () => {
      for (const symbol of [
        "C7(b9",
        "C7b9)",
        "C7()",
        "C7(foo)",
        "C79",
        "C7 9",
        "C7(b11)",
        "C7(#13)",
        "C7(b2)",
        "Cadd#5",
        "C7addmaj7",
        "C7(no4)",
        "C7(alt)",
        "Cmaj7alt",
        "C(5)",
        "Cnonsense",
        "C(b9,)x",
      ]) {
        expect(Chord.get(symbol).empty, symbol).toBe(true);
      }
      expect(Chord.get("#11").empty).toBe(true);
    });

    test("family", () => {
      const family = (symbol: string) => Chord.get(symbol).family;
      expect(family("Cmaj7/B")).toEqual("major");
      expect(family("C7b9/E")).toEqual("dominant");
      expect(family("Dm7b5")).toEqual("half-diminished");
      expect(family("Cm7b5b9")).toEqual("half-diminished");
      expect(family("C7(b9,#9)")).toEqual("dominant");
      expect(family("C7(no3)")).toEqual("dominant");
      expect(family("C(no3)")).toEqual("power");
      expect(family("Cdim(maj7)")).toEqual("diminished");
      expect(family("C7sus4b9")).toEqual("suspended");
      expect(family("Cnonsense")).toEqual("");
    });

    test("alt is 7#5#9", () => {
      expect(notes("C7alt")).toEqual("C E G# Bb D#");
    });

    test("no chord", () => {
      const noChord = {
        empty: false,
        name: "no chord",
        symbol: "N.C.",
        type: "no chord",
        tonic: null,
        root: "",
        bass: "",
        rootDegree: 0,
        setNum: NaN,
        chroma: "",
        normalized: "",
        quality: "Unknown",
        family: "",
        complexity: 0,
        aliases: ["N.C.", "NC"],
        intervals: [],
        notes: [],
      };
      expect(Chord.get("N.C.")).toEqual(noChord);
      expect(Chord.get("NC")).toEqual(noChord);
      expect(Chord.get("n.c.")).toEqual(noChord);
      expect(Chord.get(["", "N.C."])).toEqual(noChord);
      expect(Chord.getChord("NC")).toEqual(noChord);
      expect(Chord.get("CN.C.").empty).toBe(true);
      expect(Chord.get("N.C./E").empty).toBe(true);
      expect(Chord.getChord("NC", "C").empty).toBe(true);
      expect(Chord.notes("N.C.")).toEqual([]);
      expect(Chord.transpose("N.C.", "P5")).toEqual("N.C.");
      expect(Chord.chordScales("N.C.")).toEqual([]);
      expect(Chord.extended("N.C.")).toEqual([]);
      expect(Chord.reduced("N.C.")).toEqual([]);
    });
  });

  describe("names", () => {
    test("types without a long name are named by their symbol", () => {
      expect(Chord.get("Cadd9").name).toEqual("Cadd9");
      expect(Chord.get("C2").name).toEqual("C2");
      expect(Chord.get("C4").name).toEqual("C4");
      expect(Chord.get("Cadd9/E").name).toEqual("Cadd9 over E");
      expect(Chord.get("C7b9#9").name).toEqual("C7b9#9");
      expect(Chord.get("add9").name).toEqual("add9");
      expect(Chord.get("Cmaj7").name).toEqual("C major seventh");
      expect(Chord.get("C/E").name).toEqual("C major over E");
      expect(Chord.get("maj7").name).toEqual("major seventh");
    });

    test("no name has a leading or trailing space", () => {
      const tonics = "CDEFGAB".split("").flatMap((l) => [l + "b", l, l + "#"]);
      for (const type of ChordType.all()) {
        for (const tonic of ["", ...tonics]) {
          for (const alias of type.aliases) {
            const chord = Chord.get([tonic, alias]);
            expect(chord.name).toEqual(chord.name.trim());
            if (!type.name) expect(chord.name).toEqual(tonic + alias);
          }
        }
      }
    });
  });

  test("every name detect finds parses back to its notes and bass", () => {
    const tonics = "CDEFGAB".split("").flatMap((l) => [l + "b", l, l + "#"]);
    const chroma = (notes: string[]) =>
      [...new Set(notes.map((n) => note(n).chroma))].sort((a, b) => a - b);
    for (const type of ChordType.all()) {
      for (const tonic of tonics) {
        const notes = Chord.getChord(type.aliases[0], tonic).notes;
        notes.forEach((_, i) => {
          const inversion = [...notes.slice(i), ...notes.slice(0, i)];
          for (const name of Chord.detect(inversion)) {
            const chord = Chord.get(name);
            expect(chroma(chord.notes)).toEqual(chroma(inversion));
            expect(note(chord.bass || chord.tonic!).chroma).toBe(
              note(inversion[0]).chroma,
            );
          }
        });
      }
    }
  });

  test("detect puts only unusual types after other readings", () => {
    // In root position, a chord type loses first place only when its reading
    // is unusual (see @tonaljs/chord-detect). A change to the chord types
    // or to the rule that changes this list should be deliberate.
    const tonics = "CDEFGAB".split("").flatMap((l) => [l + "b", l, l + "#"]);
    const demoted = ChordType.all()
      .map((type) => type.aliases[0])
      .filter((alias) =>
        tonics.some((tonic) => {
          const notes = Chord.getChord(alias, tonic).notes;
          const first = Chord.get(Chord.detect(notes)[0] ?? "");
          return first.tonic !== tonic || first.bass !== "";
        }),
      );
    expect(demoted.sort()).toEqual(
      $("m#5 m11A m7#5 m7b6 m9b6 mMaj7b6 mMaj9b6 mb6 mb6b9 o7M7 quartal"),
    );
  });

  describe("degrees by name", () => {
    const TONICS = $("C C# Db D Eb E F F# Gb G Ab A Bb B");
    const NOTES = $("C C# D Eb E F F# G Ab A Bb B");

    test("degreeOf chord tones", () => {
      expect(Chord.degreeOf("C7b9", "Db")).toBe("b9");
      expect(Chord.degreeOf("C7b9", "C#4")).toBe("b9");
      expect(Chord.degreeOf("Cm7", "Eb")).toBe("b3");
      expect(Chord.degreeOf("Cdim7", "A")).toBe("bb7");
      expect(Chord.degreeOf("C7#5", "G#")).toBe("#5");
      expect(Chord.degreeOf("C6", "A")).toBe("6");
      expect(Chord.degreeOf("C13", "A")).toBe("13");
      expect(Chord.degreeOf("Csus4", "F")).toBe("4");
      expect(Chord.degreeOf("C11", "F")).toBe("11");
      expect(Chord.degreeOf("Csus2", "D")).toBe("2");
      expect(Chord.degreeOf("Cadd9", "D")).toBe("9");
      expect(Chord.degreeOf("C4", "Eb")).toBe("b3");
      expect(Chord.degreeOf("C7b9#9", "Eb")).toBe("#9");
    });

    test("degreeOf other notes", () => {
      const degrees = (chord: string) =>
        NOTES.map((n) => Chord.degreeOf(chord, n)).join(" ");
      expect(degrees("C")).toBe("1 b9 9 #9 3 11 #11 5 b13 6 b7 7");
      expect(degrees("C7")).toBe("1 b9 9 #9 3 11 #11 5 b13 13 b7 7");
      expect(degrees("Cm")).toBe("1 b9 9 b3 3 11 #11 5 b13 6 b7 7");
      expect(degrees("Cm7")).toBe("1 b9 9 b3 3 11 #11 5 b13 13 b7 7");
      expect(degrees("Csus4")).toBe("1 b9 9 b3 3 4 #11 5 b13 6 b7 7");
      expect(degrees("C5")).toBe("1 b9 9 b3 3 4 #11 5 b13 6 b7 7");
      expect(degrees("Cdim7")).toBe("1 b9 9 b3 3 11 b5 5 b13 bb7 b7 7");
      expect(Chord.degreeOf("C7(no3)", "F")).toBe("4");
      expect(Chord.degreeOf("Cdim", "A")).toBe("6");
    });

    test("degreeOf is measured from the root", () => {
      expect(Chord.degreeOf("C7/E", "E")).toBe("3");
      expect(Chord.degreeOf("C7/E", "C")).toBe("1");
      expect(Chord.degreeOf("Csus2/G", "D")).toBe("2");
      expect(Chord.degreeOf("C/D", "D")).toBe("9");
      expect(Chord.degreeOf(["C4", "maj7"], "B")).toBe("7");
    });

    test("degreeOf without tonic or note", () => {
      expect(Chord.degreeOf("maj7", "B")).toBe("");
      expect(Chord.degreeOf("C", "x")).toBe("");
      expect(Chord.degreeOf("Cnonsense", "C")).toBe("");
      expect(Chord.degreeOf("N.C.", "C")).toBe("");
    });

    test("noteOf", () => {
      expect(Chord.noteOf("C7b9", "b9")).toBe("Db");
      expect(Chord.noteOf("C#7", "b9")).toBe("D");
      expect(Chord.noteOf("Cdim7", "bb7")).toBe("Bbb");
      expect(Chord.noteOf("C", "13")).toBe("A");
      expect(Chord.noteOf("C", "#11")).toBe("F#");
      expect(Chord.noteOf("C", "b5")).toBe("Gb");
      expect(Chord.noteOf(["C4", "7"], "b7")).toBe("Bb");
      expect(Chord.noteOf("C7/E", "1")).toBe("C");
      expect(Chord.noteOf("C", "8")).toBe("C");
    });

    test("noteOf counts from the major scale of the root", () => {
      expect(Chord.noteOf("Cm7", "b3")).toBe("Eb");
      expect(Chord.noteOf("Cm7", "3")).toBe("E");
      expect(Chord.noteOf("Cm7", "7")).toBe("B");
      expect(Chord.noteOf("C7#5", "5")).toBe("G");
      expect(Chord.noteOf("C7b9", "9")).toBe("D");
    });

    test("noteOf without tonic or degree", () => {
      expect(Chord.noteOf("maj7", "3")).toBe("");
      expect(Chord.noteOf("C", "x")).toBe("");
      expect(Chord.noteOf("C", "")).toBe("");
      expect(Chord.noteOf("C", "0")).toBe("");
      expect(Chord.noteOf("C", "b#3")).toBe("");
      expect(Chord.noteOf("Cnonsense", "3")).toBe("");
      expect(Chord.noteOf("N.C.", "1")).toBe("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(Chord.noteOf("C", 3 as any)).toBe("");
    });

    test("formula", () => {
      expect(Chord.formula("Cm7")).toEqual($("1 b3 5 b7"));
      expect(Chord.formula("dim7")).toEqual($("1 b3 b5 bb7"));
      expect(Chord.formula("C6")).toEqual($("1 3 5 6"));
      expect(Chord.formula("C13")).toEqual($("1 3 5 b7 9 13"));
      expect(Chord.formula("Csus4")).toEqual($("1 4 5"));
      expect(Chord.formula("C11")).toEqual($("1 5 b7 9 11"));
      expect(Chord.formula("C4")).toEqual($("1 4 b7 b3"));
      expect(Chord.formula("C7b9#11")).toEqual($("1 3 5 b7 b9 #11"));
      expect(Chord.formula("C13/E")).toEqual($("1 3 5 b7 9 13"));
      expect(Chord.formula("Csus2/G")).toEqual($("1 2 5"));
      expect(Chord.formula("Cmaj7/B")).toEqual($("1 3 5 7"));
      expect(Chord.formula("C/D")).toEqual($("1 3 5"));
      expect(Chord.formula("Cnonsense")).toEqual([]);
    });

    test("every chord tone has its degree, and back", () => {
      for (const type of ChordType.all()) {
        for (const tonic of TONICS) {
          const chord: [string, string] = [tonic, type.aliases[0]];
          const notes = Chord.notes(chord);
          const degrees = notes.map((n) => Chord.degreeOf(chord, n));
          expect(degrees).toEqual(Chord.formula(chord));
          expect(new Set(degrees).size).toBe(notes.length);
          expect(degrees.map((d) => Chord.noteOf(chord, d))).toEqual(notes);
        }
      }
    });

    test("every note has a degree, and back", () => {
      for (const type of ChordType.all()) {
        for (const tonic of TONICS) {
          const chord: [string, string] = [tonic, type.aliases[0]];
          for (const n of NOTES) {
            const degree = Chord.degreeOf(chord, tonic === "C" ? n : n + "4");
            expect(degree).toMatch(/^(b*|#*)\d+$/);
            expect(note(Chord.noteOf(chord, degree)).chroma).toBe(
              note(n).chroma,
            );
          }
        }
      }
    });

    test("degreesByImportance", () => {
      expect(Chord.degreesByImportance("C")).toEqual($("3 1 5"));
      expect(Chord.degreesByImportance("Cm")).toEqual($("b3 1 5"));
      expect(Chord.degreesByImportance("Cdim")).toEqual($("b3 b5 1"));
      expect(Chord.degreesByImportance("Caug")).toEqual($("3 #5 1"));
      expect(Chord.degreesByImportance("C5")).toEqual($("1 5"));
      expect(Chord.degreesByImportance("C6")).toEqual($("3 6 1 5"));
      expect(Chord.degreesByImportance("m6")).toEqual($("b3 6 1 5"));
      expect(Chord.degreesByImportance("C6/9")).toEqual($("3 6 9 1 5"));
      expect(Chord.degreesByImportance("Csus4")).toEqual($("4 1 5"));
      expect(Chord.degreesByImportance("Csus2")).toEqual($("2 1 5"));
      expect(Chord.degreesByImportance("C7sus4")).toEqual($("4 b7 1 5"));
      expect(Chord.degreesByImportance("C9sus4")).toEqual($("4 b7 9 1 5"));
      expect(Chord.degreesByImportance("C11")).toEqual($("11 b7 9 1 5"));
      expect(Chord.degreesByImportance("Cmaj7")).toEqual($("3 7 1 5"));
      expect(Chord.degreesByImportance("C7")).toEqual($("3 b7 1 5"));
      expect(Chord.degreesByImportance("Cm7b5")).toEqual($("b3 b5 b7 1"));
      expect(Chord.degreesByImportance("Cdim7")).toEqual($("b3 b5 bb7 1"));
      expect(Chord.degreesByImportance("C7#5")).toEqual($("3 #5 b7 1"));
      expect(Chord.degreesByImportance("C7b9")).toEqual($("3 b7 b9 1 5"));
      expect(Chord.degreesByImportance("C7#5#9")).toEqual($("3 #5 b7 #9 1"));
      expect(Chord.degreesByImportance("Calt7")).toEqual($("3 b7 b9 1"));
      expect(Chord.degreesByImportance("C7b9b13")).toEqual(
        $("3 b7 b9 1 5 b13"),
      );
      expect(Chord.degreesByImportance("C13")).toEqual($("3 b7 9 1 5 13"));
      expect(Chord.degreesByImportance("Cm11")).toEqual($("b3 b7 9 1 5 11"));
      expect(Chord.degreesByImportance("C13#11")).toEqual(
        $("3 b7 9 1 5 #11 13"),
      );
      expect(Chord.degreesByImportance("C7(no3)")).toEqual($("b7 1 5"));
      expect(Chord.degreesByImportance("C7/E")).toEqual($("3 b7 1 5"));
      expect(Chord.degreesByImportance("Cnonsense")).toEqual([]);
    });

    test("degreesByImportance lists every degree of every chord type once", () => {
      for (const type of ChordType.all()) {
        const chord: [string, string] = ["C", type.aliases[0]];
        const degrees = Chord.formula(chord);
        const sorted = Chord.degreesByImportance(chord);
        expect([...sorted].sort()).toEqual([...degrees].sort());
        const third = degrees.find((d) => /^(b*|#*)3$/.test(d));
        if (third) expect(sorted[0]).toBe(third);
      }
    });
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
