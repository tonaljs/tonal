/* global describe test expect */
const Scale = require("./");

const $ = s => s.split(" ");

describe("tonal-scale", () => {
  test("props", () => {
    expect(Scale.props("major")).toEqual({
      tonic: null,
      name: "major",
      names: ["major", "ionian"],
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      notes: [],
      chroma: "101011010101",
      setnum: 2773
    });
    expect(Scale.props("C5 pentatonic")).toEqual({
      tonic: "C5",
      name: "major pentatonic",
      names: ["major pentatonic", "pentatonic"],
      intervals: ["1P", "2M", "3M", "5P", "6M"],
      notes: ["C5", "D5", "E5", "G5", "A5"],
      chroma: "101010010100",
      setnum: 2708
    });
  });

  test("tokenize", () => {
    expect(Scale.tokenize("c major")).toEqual(["C", "major"]);
    expect(Scale.tokenize("cb3 major")).toEqual(["Cb3", "major"]);
    expect(Scale.tokenize("melodic minor")).toEqual([null, "melodic minor"]);
    expect(Scale.tokenize("c")).toEqual(["C", ""]);
    expect(Scale.tokenize()).toEqual([null, ""]);
  });

  test("exists", () => {
    expect(Scale.exists("major")).toBe(true);
    expect(Scale.exists("Db major")).toBe(true);
    expect(Scale.exists("Maj7")).toBe(false);
  });

  test("intervals", () => {
    expect(Scale.intervals("major")).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(Scale.intervals("C major")).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(Scale.intervals("blah")).toEqual([]);
  });

  test("notes", () => {
    expect(Scale.notes("C major")).toEqual($("C D E F G A B"));
    expect(Scale.notes("C", "major")).toEqual($("C D E F G A B"));
    expect(Scale.notes("C4", "major")).toEqual($("C4 D4 E4 F4 G4 A4 B4"));
    expect(Scale.notes("eb", "bebop")).toEqual($("Eb F G Ab Bb C Db D"));
    expect(Scale.notes("C", "no-scale")).toEqual([]);
    const penta = [null, null, null, null, null];
    expect(Scale.notes("no-note", "pentatonic")).toEqual(penta);
  });

  test("names", () => {
    expect(Scale.names().length > 0).toBeTruthy();
    expect(Scale.names(true).length > Scale.names().length).toBeTruthy();
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

  test("chords: find all chords that fits into this scale", () => {
    expect(Scale.chords("pentatonic")).toEqual($("5 Madd9 M 6 sus2"));
    expect(Scale.chords("none")).toEqual([]);
  });

  test("supersets: find all scales that extends this one", () => {
    expect(Scale.supersets("major")).toEqual([
      "bebop",
      "bebop major",
      "chromatic",
      "ichikosucho"
    ]);
    expect(Scale.supersets("none")).toEqual([]);
  });

  test("subsets: all scales that are included in the given one", () => {
    expect(Scale.subsets("major")).toEqual([
      "ionian pentatonic",
      "major pentatonic",
      "ritusen"
    ]);
    expect(Scale.subsets("none")).toEqual([]);
  });

  test("toScale", () => {
    expect(Scale.toScale($("C4 c3 C5 C4 c4"))).toEqual(["C"]);
    expect(Scale.toScale($("C4 f3 c#10 b5 d4 cb4"))).toEqual(
      $("C C# D F B Cb")
    );
    expect(Scale.toScale($("D4 c#5 A5 F#6"))).toEqual(["D", "F#", "A", "C#"]);
  });
});
