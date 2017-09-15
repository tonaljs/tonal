/* global describe test expect */
var scale = require("../index");

const arr = s => s.split(" ");

describe("tonal-scale", () => {
  test("parse", () => {
    expect(scale.parseName("cb3 major")).toEqual({
      tonic: "Cb3",
      type: "major"
    });
    expect(scale.parseName("melodic minor")).toEqual({
      tonic: false,
      type: "melodic minor"
    });
    expect(scale.parseName()).toBe(null);
  });

  test("exists", () => {
    expect(scale.exists("major")).toBe(true);
    expect(scale.exists("Maj7")).toBe(false);
  });

  test("intervals", () => {
    expect(scale.intervals("C major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(scale.intervals("major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(scale.intervals("blah")).toEqual([]);
  });

  test("notes", () => {
    expect(scale.notes("C major")).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
    expect(scale.notes("C4 major")).toEqual(scale.notes("C major"));
    expect(scale.notes("Eb bebop")).toEqual(arr("Eb F G Ab Bb C Db D"));
    expect(scale.notes("Eb bebop", "Cb")).toEqual(
      arr("Cb Db Eb Fb Gb Ab Bbb Bb")
    );
    expect(scale.notes("Cmaj7")).toEqual([]);
    expect(scale.notes("blah")).toEqual([]);
  });

  test("names", () => {
    expect(scale.names().length > 0).toBeTruthy();
    expect(scale.names(true).length > scale.names().length).toBeTruthy();
  });

  test("modes", () => {
    expect(scale.modes("C major")).toEqual([
      "C ionian",
      "D dorian",
      "E phrygian",
      "F lydian",
      "G dominant",
      "A aeolian",
      "B locrian"
    ]);
  });

  test("names with filter", () => {
    expect(
      scale.names(true, function(name, intervals) {
        return intervals.length === 9;
      })
    ).toEqual(arr("composite blues"));
  });

  test("detect", () => {
    expect(scale.detect("f3 a c5 e2 d g2 b6").join("|")).toEqual(
      "C major|D dorian|E phrygian|F lydian|G mixolydian|A aeolian|B locrian"
    );
  });
});
