import Scale from "./index";

const $ = (s: string) => s.split(" ");

describe("@tonaljs/scale", () => {
  test("scale", () => {
    expect(Scale.get("major")).toEqual({
      empty: false,
      tonic: "",
      notes: [],
      type: "major",
      name: "major",
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      aliases: ["ionian"],
      setNum: 2773,
      chroma: "101011010101",
      normalized: "101010110101",
    });
    expect(Scale.get("c5 pentatonic")).toEqual({
      empty: false,
      name: "C5 major pentatonic",
      type: "major pentatonic",
      tonic: "C5",
      notes: ["C5", "D5", "E5", "G5", "A5"],
      intervals: ["1P", "2M", "3M", "5P", "6M"],
      aliases: ["pentatonic"],
      setNum: 2708,
      chroma: "101010010100",
      normalized: "100101001010",
    });
    expect(Scale.get("C4 major")).toEqual(Scale.get(["C4", "major"]));
  });

  test("tokenize", () => {
    expect(Scale.tokenize("c major")).toEqual(["C", "major"]);
    expect(Scale.tokenize("cb3 major")).toEqual(["Cb3", "major"]);
    expect(Scale.tokenize("melodic minor")).toEqual(["", "melodic minor"]);
    expect(Scale.tokenize("dorian")).toEqual(["", "dorian"]);
    expect(Scale.tokenize("c")).toEqual(["C", ""]);
    expect(Scale.tokenize("")).toEqual(["", ""]);
  });
  test("isKnown", () => {
    expect(Scale.get("major").empty).toBe(false);
    expect(Scale.get("Db major").empty).toBe(false);
    expect(Scale.get("hello").empty).toBe(true);
    expect(Scale.get("").empty).toBe(true);
    expect(Scale.get("Maj7").empty).toBe(true);
  });

  test("intervals", () => {
    expect(Scale.get("major").intervals).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(Scale.get("C major").intervals).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(Scale.get("blah").intervals).toEqual([]);
  });

  test("notes", () => {
    expect(Scale.get("C major").notes).toEqual($("C D E F G A B"));
    expect(Scale.get("C lydian #9").notes).toEqual($("C D# E F# G A B"));
    expect(Scale.get(["C", "major"]).notes).toEqual($("C D E F G A B"));
    expect(Scale.get(["C4", "major"]).notes).toEqual($("C4 D4 E4 F4 G4 A4 B4"));
    expect(Scale.get(["eb", "bebop"]).notes).toEqual($("Eb F G Ab Bb C Db D"));
    expect(Scale.get(["C", "no-scale"]).notes).toEqual([]);
    expect(Scale.get(["no-note", "major"]).notes).toEqual([]);
  });

  describe("Scale.detect", () => {
    test("detect exact match", () => {
      expect(
        Scale.detect(["D", "E", "F#", "A", "B"], { match: "exact" })
      ).toEqual(["D major pentatonic"]);
      expect(
        Scale.detect(["D", "E", "F#", "A", "B"], { match: "exact", tonic: "B" })
      ).toEqual(["B minor pentatonic"]);
      expect(
        Scale.detect(["D", "F#", "B", "C", "C#"], { match: "exact" })
      ).toEqual([]);
      expect(
        Scale.detect(["c", "d", "e", "f", "g", "a", "b"], { match: "exact" })
      ).toEqual(["C major"]);
      expect(
        Scale.detect(["c2", "d6", "e3", "f1", "g7", "a6", "b5"], {
          match: "exact",
          tonic: "d",
        })
      ).toEqual(["D dorian"]);
    });

    test("detect fit match", () => {
      expect(
        Scale.detect(["C", "D", "E", "F", "G", "A", "B"], { match: "fit" })
      ).toEqual([
        "C major",
        "C bebop",
        "C bebop major",
        "C ichikosucho",
        "C chromatic",
      ]);
      expect(
        Scale.detect(["D", "F#", "B", "C", "C#"], { match: "fit" })
      ).toEqual(["D bebop", "D kafi raga", "D chromatic"]);
      expect(Scale.detect(["Ab", "Bb", "C", "Db", "Eb", "G"])).toEqual([
        "Ab major",
        "Ab bebop",
        "Ab harmonic major",
        "Ab bebop major",
        "Ab ichikosucho",
        "Ab chromatic",
      ]);
    });

    test("tonic will be added", () => {
      expect(
        Scale.detect(["c", "d", "e", "f", "g", "b"], { match: "exact" })
      ).toEqual([]);
      expect(
        Scale.detect(["c", "d", "e", "f", "g", "b"], {
          match: "exact",
          tonic: "a",
        })
      ).toEqual(["A minor"]);
    });
  });

  test("Ukrainian Dorian scale", () => {
    // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
    expect(Scale.get("C romanian minor").notes).toEqual($("C D Eb F# G A Bb"));
    expect(Scale.get("C ukrainian dorian").notes).toEqual(
      $("C D Eb F# G A Bb")
    );
    expect(Scale.get("B romanian minor").notes).toEqual($("B C# D E# F# G# A"));
    expect(Scale.get("B dorian #4").notes).toEqual($("B C# D E# F# G# A"));
    expect(Scale.get("B altered dorian").notes).toEqual($("B C# D E# F# G# A"));
  });

  test("chords: find all chords that fits into this scale", () => {
    expect(Scale.scaleChords("pentatonic")).toEqual($("5 M 6 sus2 Madd9"));
    expect(Scale.scaleChords("none")).toEqual([]);
  });

  test("extended: find all scales that extends this one", () => {
    expect(Scale.extended("major")).toEqual([
      "bebop",
      "bebop major",
      "ichikosucho",
      "chromatic",
    ]);
    expect(Scale.extended("none")).toEqual([]);
  });

  test("Scale.reduced: all scales that are included in the given one", () => {
    expect(Scale.reduced("major")).toEqual([
      "major pentatonic",
      "ionian pentatonic",
      "ritusen",
    ]);
    expect(Scale.reduced("D major")).toEqual(Scale.reduced("major"));
    expect(Scale.reduced("none")).toEqual([]);
  });

  describe("specific and problematic scales", () => {
    test("whole note scale should use 6th", () => {
      expect(Scale.get("C whole tone").notes.join(" ")).toEqual(
        "C D E F# G# A#"
      );
      expect(Scale.get("Db whole tone").notes.join(" ")).toEqual(
        "Db Eb F G A B"
      );
    });
  });

  test("scaleNotes", () => {
    expect(Scale.scaleNotes($("C4 c3 C5 C4 c4"))).toEqual(["C"]);
    expect(Scale.scaleNotes($("C4 f3 c#10 b5 d4 cb4"))).toEqual(
      $("C C# D F B Cb")
    );
    expect(Scale.scaleNotes($("D4 c#5 A5 F#6"))).toEqual([
      "D",
      "F#",
      "A",
      "C#",
    ]);
  });

  test("mode names", () => {
    expect(Scale.modeNames("pentatonic")).toEqual([
      ["1P", "major pentatonic"],
      ["2M", "egyptian"],
      ["3M", "malkos raga"],
      ["5P", "ritusen"],
      ["6M", "minor pentatonic"],
    ]);
    expect(Scale.modeNames("whole tone pentatonic")).toEqual([
      ["1P", "whole tone pentatonic"],
    ]);
    expect(Scale.modeNames("C pentatonic")).toEqual([
      ["C", "major pentatonic"],
      ["D", "egyptian"],
      ["E", "malkos raga"],
      ["G", "ritusen"],
      ["A", "minor pentatonic"],
    ]);
    expect(Scale.modeNames("C whole tone pentatonic")).toEqual([
      ["C", "whole tone pentatonic"],
    ]);
  });

  describe("rangeOf", () => {
    test("range of a scale name", () => {
      const range = Scale.rangeOf("C pentatonic");
      expect(range("C4", "C5").join(" ")).toEqual("C4 D4 E4 G4 A4 C5");
      expect(range("C5", "C4").join(" ")).toEqual("C5 A4 G4 E4 D4 C4");
      expect(range("g3", "a2").join(" ")).toEqual("G3 E3 D3 C3 A2");
    });

    test("range of a scale name with flat", () => {
      const range = Scale.rangeOf("Cb major");
      expect(range("Cb4", "Cb5").join(" ")).toEqual(
        "Cb4 Db4 Eb4 Fb4 Gb4 Ab4 Bb4 Cb5"
      );
    });

    test("range of a scale name with sharp", () => {
      const range = Scale.rangeOf("C# major");
      expect(range("C#4", "C#5").join(" ")).toEqual(
        "C#4 D#4 E#4 F#4 G#4 A#4 B#4 C#5"
      );
    });

    test("range of a scale without tonic", () => {
      const range = Scale.rangeOf("pentatonic");
      expect(range("C4", "C5")).toEqual([]);
    });

    test("range of a list of notes", () => {
      const range = Scale.rangeOf(["c4", "g4", "db3", "g"]);
      expect(range("c4", "c5").join(" ")).toEqual("C4 Db4 G4 C5");
    });

    describe("degrees", () => {
      test("positive scale degrees", () => {
        expect(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            .map(Scale.degrees("C major"))
            .join(" ")
        ).toEqual("C D E F G A B C D E");
        expect(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            .map(Scale.degrees("C4 major"))
            .join(" ")
        ).toEqual("C4 D4 E4 F4 G4 A4 B4 C5 D5 E5");
        expect(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            .map(Scale.degrees("C4 pentatonic"))
            .join(" ")
        ).toEqual("C4 D4 E4 G4 A4 C5 D5 E5 G5 A5 C6");
      });
      test("invalid inputs", () => {
        expect(Scale.degrees("C major")(0)).toBe("");
        expect(Scale.degrees("C nonsense")(0)).toBe("");
      });
    });

    test("negative scale degrees", () => {
      expect(
        [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
          .map(Scale.degrees("C major"))
          .join(" ")
      ).toEqual("B A G F E D C B A G");
      expect(
        [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
          .map(Scale.degrees("C4 major"))
          .join(" ")
      ).toEqual("B3 A3 G3 F3 E3 D3 C3 B2 A2 G2");
      expect(
        [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11]
          .map(Scale.degrees("C4 pentatonic"))
          .join(" ")
      ).toEqual("A3 G3 E3 D3 C3 A2 G2 E2 D2 C2 A1");
    });
  });
});
