// tslint:disable-next-line: no-implicit-dependencies
import { describe, expect, test } from "vitest";

import { get as scale } from "@tonaljs/scale";
// tslint:disable-next-line: no-implicit-dependencies
import { get as chord } from "@tonaljs/chord";
import * as Key from "./index";

describe("@tonal/key", () => {
  test("fromAlter", () => {
    expect(Key.majorTonicFromKeySignature("###")).toEqual("A");
    expect(Key.majorTonicFromKeySignature(3)).toEqual("A");
    expect(Key.majorTonicFromKeySignature("b")).toEqual("F");
    expect(Key.majorTonicFromKeySignature("bb")).toEqual("Bb");
    expect(Key.majorTonicFromKeySignature("other")).toEqual(null);
  });
  test("major keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(
      tonics.map((tonic) => Key.majorKey(tonic).keySignature).join(" "),
    ).toEqual(" ## #### b # ### #####");
  });

  test("minor keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(
      tonics.map((tonic) => Key.minorKey(tonic).keySignature).join(" "),
    ).toEqual("bbb b # bbbb bb  ##");
  });

  describe("scale names", () => {
    test("natural scales", () => {
      const chordScales = Key.minorKey("C").natural.chordScales;
      expect(chordScales.map(scale).map((scale) => scale.name)).toEqual([
        "C minor",
        "D locrian",
        "Eb major",
        "F dorian",
        "G phrygian",
        "Ab lydian",
        "Bb mixolydian",
      ]);
    });

    test("harmonic scales", () => {
      const chordScales = Key.minorKey("C").harmonic.chordScales;
      expect(chordScales.map(scale).map((scale) => scale.name)).toEqual([
        "C harmonic minor",
        "D locrian 6",
        "Eb major augmented",
        "F lydian diminished",
        "G phrygian dominant",
        "Ab lydian #9",
        "B ultralocrian",
      ]);
    });

    test("melodic scales", () => {
      const chordScales = Key.minorKey("C").melodic.chordScales;
      expect(chordScales.map(scale).map((scale) => scale.name)).toEqual([
        "C melodic minor",
        "D dorian b2",
        "Eb lydian augmented",
        "F lydian dominant",
        "G mixolydian b6",
        "A locrian #2",
        "B altered",
      ]);
    });
  });

  test("secondary dominants", () => {
    expect(Key.majorKey("C").secondaryDominants).toEqual([
      "",
      "A7",
      "B7",
      "C7",
      "D7",
      "E7",
      "",
    ]);
  });

  test("octaves are discarded", () => {
    expect(Key.majorKey("b4").scale.join(" ")).toEqual("B C# D# E F# G# A#");
    expect(Key.majorKey("g4").chords.join(" ")).toEqual(
      "Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F#m7b5",
    );
    expect(Key.minorKey("C4").melodic.scale.join(" ")).toEqual(
      "C D Eb F G A B",
    );
    expect(Key.minorKey("C4").melodic.chords.join(" ")).toEqual(
      "Cm6 Dm7 Eb+maj7 F7 G7 Am7b5 Bm7b5",
    );
  });

  test("valid chord names", () => {
    const major = Key.majorKey("C");
    const minor = Key.minorKey("C");

    [
      major.chords,
      major.secondaryDominants,
      major.substituteDominantSupertonics,
      major.substituteDominants,
      major.substituteDominantsMinorRelative,
      minor.natural.chords,
      minor.harmonic.chords,
      minor.melodic.chords,
    ].forEach((chords) => {
      chords.forEach((name) => {
        if (name !== "") {
          if (chord(name).name === "") throw Error(`Invalid chord: ${name}`);
          expect(chord(name).name).not.toBe("");
        }
      });
    });
  });

  test("C major", () => {
    expect(Key.majorKey("C")).toMatchSnapshot();
  });
  test("C major chords", () => {
    expect(Key.majorKeyChords("C")).toMatchSnapshot();
    const chords = Key.majorKeyChords("C");
    expect(chords.find((chord) => chord.name === "Em7")).toEqual({
      name: "Em7",
      roles: ["T", "ii/II"],
    });
  });

  test("C minor chords", () => {
    expect(Key.minorKeyChords("C")).toMatchSnapshot();
  });
  test("majorKeys", () => {
    expect(Key.majorKey("A")).toMatchSnapshot();
    expect(Key.majorKey("Bb")).toMatchSnapshot();
    expect(Key.majorKey("E")).toMatchSnapshot();
  });

  test("empty major key ", () => {
    expect(Key.majorKey("")).toMatchObject({
      type: "major",
      tonic: "",
    });
    expect(Object.keys(Key.majorKey("C")).sort()).toEqual(
      Object.keys(Key.majorKey("")).sort(),
    );
  });

  test("minorKey", () => {
    expect(Key.minorKey("C")).toMatchSnapshot();
    expect(Key.minorKey("Bb")).toMatchSnapshot();
    expect(Key.minorKey("B")).toMatchSnapshot();
  });

  test("empty minor key ", () => {
    expect(Key.minorKey("nothing")).toMatchObject({
      type: "minor",
      tonic: "",
    });
    expect(Object.keys(Key.minorKey("C")).sort()).toEqual(
      Object.keys(Key.minorKey("nothing")).sort(),
    );
  });
});
