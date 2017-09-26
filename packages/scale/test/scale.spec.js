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
  test("splitName", () => {
    expect(scale.tokenize("c major")).toEqual(["C", "major"]);
    expect(scale.tokenize("cb3 major")).toEqual(["Cb3", "major"]);
    expect(scale.tokenize("melodic minor")).toEqual([null, "melodic minor"]);
    expect(scale.tokenize("c")).toEqual(["C", null]);
    expect(scale.tokenize()).toEqual([null, null]);
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
    expect(scale.modeNames("major")).toEqual([
      "major",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian"
    ]);
  });

  test("chords: find all chords that fits into this scale", () => {
    expect(scale.chords("pentatonic")).toEqual($("5 64 M M6 M69 Madd9 Msus2"));
    expect(scale.chords("none")).toEqual([]);
  });

  test("extensions: find all scales that extends this one", () => {
    expect(scale.extensions("major")).toEqual([
      "bebop",
      "bebop dominant",
      "bebop major",
      "chromatic",
      "ichikosucho",
      "major"
    ]);
    expect(scale.extensions("none")).toEqual([]);
  });

  test("scale", () => {
    expect(scale.toScale($("C4 c3 C5 C4 c4"))).toEqual(["C"]);
    expect(scale.toScale($("C4 f3 c#10 b5 d4 cb4"))).toEqual(
      $("C C# D F B Cb")
    );
    expect(scale.toScale($("D4 c#5 A5 F#6"))).toEqual(["D", "F#", "A", "C#"]);
  });

  test.skip("detect", () => {
    expect(scale.detect($("f3 a c5 e2 d g2 b6"))).toEqual(
      "C major|D dorian|E phrygian|F lydian|G mixolydian|A aeolian|B locrian"
    );
  });
});
