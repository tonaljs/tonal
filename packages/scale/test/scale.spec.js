/* global describe test expect */
var scale = require("../index");

const $ = s => s.split(" ");

describe("tonal-scale", () => {
  test("props", () => {
    expect(scale.props("major")).toEqual({
      name: "major",
      names: ["major", "ionian"],
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      chroma: "101011010101",
      setnum: 2773
    });
  });
  test("tokenize", () => {
    expect(scale.tokenize("c major")).toEqual(["C", "major"]);
    expect(scale.tokenize("cb3 major")).toEqual(["Cb3", "major"]);
    expect(scale.tokenize("melodic minor")).toEqual(["", "melodic minor"]);
    expect(scale.tokenize("c")).toEqual(["C", ""]);
    expect(scale.tokenize()).toEqual(["", ""]);
  });

  test("exists", () => {
    expect(scale.exists("major")).toBe(true);
    expect(scale.exists("Db major")).toBe(true);
    expect(scale.exists("Maj7")).toBe(false);
  });

  test("intervals", () => {
    expect(scale.intervals("major")).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(scale.intervals("C major")).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(scale.intervals("blah")).toEqual([]);
  });

  test("notes", () => {
    expect(scale.notes("C major")).toEqual($("C D E F G A B"));
    expect(scale.notes("C", "major")).toEqual($("C D E F G A B"));
    expect(scale.notes("C4", "major")).toEqual($("C4 D4 E4 F4 G4 A4 B4"));
    expect(scale.notes("eb", "bebop")).toEqual($("Eb F G Ab Bb C Db D"));
    expect(scale.notes("C", "no-scale")).toEqual([]);
    const penta = [null, null, null, null, null];
    expect(scale.notes("no-note", "pentatonic")).toEqual(penta);
  });

  test("names", () => {
    expect(scale.names().length > 0).toBeTruthy();
    expect(scale.names(true).length > scale.names().length).toBeTruthy();
  });

  test("mode names", () => {
    expect(scale.modeNames("pentatonic")).toEqual([
      ["1P", "major pentatonic"],
      ["2M", "egyptian"],
      ["3M", "malkos raga"],
      ["5P", "ritusen"],
      ["6M", "minor pentatonic"]
    ]);
    expect(scale.modeNames("whole tone pentatonic")).toEqual([
      ["1P", "whole tone pentatonic"]
    ]);
    expect(scale.modeNames("C pentatonic")).toEqual([
      ["C", "major pentatonic"],
      ["D", "egyptian"],
      ["E", "malkos raga"],
      ["G", "ritusen"],
      ["A", "minor pentatonic"]
    ]);
    expect(scale.modeNames("C whole tone pentatonic")).toEqual([
      ["C", "whole tone pentatonic"]
    ]);
  });

  test("chords: find all chords that fits into this scale", () => {
    expect(scale.chords("pentatonic")).toEqual($("5 64 M M6 Madd9 Msus2"));
    expect(scale.chords("none")).toEqual([]);
  });

  test("supersets: find all scales that extends this one", () => {
    expect(scale.supersets("major")).toEqual([
      "bebop",
      "bebop dominant",
      "bebop major",
      "chromatic",
      "ichikosucho"
    ]);
    expect(scale.supersets("none")).toEqual([]);
  });

  test("subsets: all scales that are included in the given one", () => {
    expect(scale.subsets("major")).toEqual([
      "ionian pentatonic",
      "major pentatonic",
      "ritusen"
    ]);
    expect(scale.subsets("none")).toEqual([]);
  });

  test("toScale", () => {
    expect(scale.toScale($("C4 c3 C5 C4 c4"))).toEqual(["C"]);
    expect(scale.toScale($("C4 f3 c#10 b5 d4 cb4"))).toEqual(
      $("C C# D F B Cb")
    );
    expect(scale.toScale($("D4 c#5 A5 F#6"))).toEqual(["D", "F#", "A", "C#"]);
  });
});
