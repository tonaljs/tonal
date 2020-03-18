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
      normalized: "101010110101"
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
      normalized: "100101001010"
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

  test("chords: find all chords that fits into this scale", () => {
    expect(Scale.scaleChords("pentatonic")).toEqual($("5 M 6 sus2 Madd9"));
    expect(Scale.scaleChords("none")).toEqual([]);
  });

  test("extended: find all scales that extends this one", () => {
    expect(Scale.extended("major")).toEqual([
      "bebop",
      "bebop major",
      "ichikosucho",
      "chromatic"
    ]);
    expect(Scale.extended("none")).toEqual([]);
  });

  test("Scale.reduced: all scales that are included in the given one", () => {
    expect(Scale.reduced("major")).toEqual([
      "major pentatonic",
      "ionian pentatonic",
      "ritusen"
    ]);
    expect(Scale.reduced("D major")).toEqual(Scale.reduced("major"));
    expect(Scale.reduced("none")).toEqual([]);
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
      "C#"
    ]);
  });

  test("mode names", () => {
    expect(Scale.modeNames("pentatonic")).toEqual([
      ["1P", "major pentatonic"],
      ["2M", "egyptian"],
      ["3M", "malkos raga"],
      ["5P", "ritusen"],
      ["6M", "minor pentatonic"]
    ]);
    expect(Scale.modeNames("whole tone pentatonic")).toEqual([
      ["1P", "whole tone pentatonic"]
    ]);
    expect(Scale.modeNames("C pentatonic")).toEqual([
      ["C", "major pentatonic"],
      ["D", "egyptian"],
      ["E", "malkos raga"],
      ["G", "ritusen"],
      ["A", "minor pentatonic"]
    ]);
    expect(Scale.modeNames("C whole tone pentatonic")).toEqual([
      ["C", "whole tone pentatonic"]
    ]);
  });
});
