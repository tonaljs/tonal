/* global describe test expect */
var scale = require("../index");

const arr = s => s.split(" ");

describe("tonal-scale", () => {
  test("splitName", () => {
    expect(scale.parseName("cb3 major")).toEqual(["major", "Cb3"]);
    expect(scale.parseName("melodic minor")).toEqual(["melodic minor", null]);
    expect(scale.parseName()).toBe(null);
  });

  test("exists", () => {
    expect(scale.exists("major")).toBe(true);
    expect(scale.exists("Maj7")).toBe(false);
  });

  test("intervals", () => {
    expect(scale.intervals("major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(scale.intervals("C major")).toEqual([]);
    expect(scale.intervals("blah")).toEqual([]);
  });

  test("notes", () => {
    expect(scale.notes("major", "C")).toEqual(arr("C D E F G A B"));
    expect(scale.notes("major", "C4")).toEqual(arr("C4 D4 E4 F4 G4 A4 B4"));
    expect(scale.notes("bebop", "Eb")).toEqual(arr("Eb F G Ab Bb C Db D"));
    expect(scale.notes("maj7", "C")).toEqual([]);
    expect(scale.notes("major")).toEqual([]);
    expect(scale.notes("C major")).toEqual([]);
  });

  test("names", () => {
    expect(scale.names().length > 0).toBeTruthy();
    expect(scale.names(true).length > scale.names().length).toBeTruthy();
  });

  test("modes", () => {
    expect(scale.modes("major")).toEqual([
      "ionian",
      "dorian",
      "phrygian",
      "lydian",
      "dominant",
      "aeolian",
      "locrian"
    ]);
  });

  test("chords: find all chords that fits into this scale", () => {
    expect(scale.chords("pentatonic")).toEqual(
      arr("5 64 M M6 M69 Madd9 Msus2")
    );
  });

  test("detect", () => {
    expect(scale.detect("f3 a c5 e2 d g2 b6").join("|")).toEqual(
      "C major|D dorian|E phrygian|F lydian|G mixolydian|A aeolian|B locrian"
    );
  });
});
