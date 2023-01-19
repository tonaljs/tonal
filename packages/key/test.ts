// tslint:disable-next-line: no-implicit-dependencies
import { get as scale } from "@tonaljs/scale";
// tslint:disable-next-line: no-implicit-dependencies
import { get as chord } from "@tonaljs/chord";
import Key from "./index";

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
      tonics.map((tonic) => Key.majorKey(tonic).keySignature).join(" ")
    ).toEqual(" ## #### b # ### #####");
  });

  test("minor keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(
      tonics.map((tonic) => Key.minorKey(tonic).keySignature).join(" ")
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
      "Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F#m7b5"
    );
    expect(Key.minorKey("C4").melodic.scale.join(" ")).toEqual(
      "C D Eb F G A B"
    );
    expect(Key.minorKey("C4").melodic.chords.join(" ")).toEqual(
      "Cm6 Dm7 Eb+maj7 F7 G7 Am7b5 Bm7b5"
    );
  });

  test("valid chord names", () => {
    const major = Key.majorKey("C");
    const minor = Key.minorKey("C");

    [
      major.chords,
      major.secondaryDominants,
      major.secondaryDominantsMinorRelative,
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

  test("majorKey", () => {
    expect(Key.majorKey("C")).toMatchInlineSnapshot(`
      {
        "alteration": 0,
        "chordScales": [
          "C major",
          "D dorian",
          "E phrygian",
          "F lydian",
          "G mixolydian",
          "A minor",
          "B locrian",
        ],
        "chords": [
          "Cmaj7",
          "Dm7",
          "Em7",
          "Fmaj7",
          "G7",
          "Am7",
          "Bm7b5",
        ],
        "chordsHarmonicFunction": [
          "T",
          "SD",
          "T",
          "SD",
          "D",
          "T",
          "D",
        ],
        "grades": [
          "I",
          "II",
          "III",
          "IV",
          "V",
          "VI",
          "VII",
        ],
        "intervals": [
          "1P",
          "2M",
          "3M",
          "4P",
          "5P",
          "6M",
          "7M",
        ],
        "keySignature": "",
        "minorRelative": "A",
        "scale": [
          "C",
          "D",
          "E",
          "F",
          "G",
          "A",
          "B",
        ],
        "secondaryDominants": [
          "",
          "A7",
          "B7",
          "C7",
          "D7",
          "E7",
          "",
        ],
        "secondaryDominantsMinorRelative": [
          "",
          "Em7b5",
          "F#m7",
          "Gm7",
          "Am7",
          "Bm7b5",
          "",
        ],
        "substituteDominants": [
          "",
          "Eb7",
          "F7",
          "Gb7",
          "Ab7",
          "Bb7",
          "",
        ],
        "substituteDominantsMinorRelative": [
          "",
          "Em7",
          "Cm7",
          "Dbm7",
          "Am7",
          "Fm7",
          "",
        ],
        "tonic": "C",
        "triads": [
          "C",
          "Dm",
          "Em",
          "F",
          "G",
          "Am",
          "Bdim",
        ],
        "type": "major",
      }
    `);
  });

  test("empty major key ", () => {
    expect(Key.majorKey("")).toMatchObject({
      type: "major",
      tonic: "",
    });
    expect(Object.keys(Key.majorKey("C")).sort()).toEqual(
      Object.keys(Key.majorKey("")).sort()
    );
  });

  test("minorKey", () => {
    expect(Key.minorKey("C")).toMatchInlineSnapshot(`
      {
        "alteration": -3,
        "harmonic": {
          "chordScales": [
            "C harmonic minor",
            "D locrian 6",
            "Eb major augmented",
            "F lydian diminished",
            "G phrygian dominant",
            "Ab lydian #9",
            "B ultralocrian",
          ],
          "chords": [
            "CmMaj7",
            "Dm7b5",
            "Eb+maj7",
            "Fm7",
            "G7",
            "Abmaj7",
            "Bo7",
          ],
          "chordsHarmonicFunction": [
            "T",
            "SD",
            "T",
            "SD",
            "D",
            "SD",
            "D",
          ],
          "grades": [
            "I",
            "II",
            "bIII",
            "IV",
            "V",
            "bVI",
            "VII",
          ],
          "intervals": [
            "1P",
            "2M",
            "3m",
            "4P",
            "5P",
            "6m",
            "7M",
          ],
          "scale": [
            "C",
            "D",
            "Eb",
            "F",
            "G",
            "Ab",
            "B",
          ],
          "tonic": "C",
          "triads": [
            "Cm",
            "Ddim",
            "Ebaug",
            "Fm",
            "G",
            "Ab",
            "Bdim",
          ],
        },
        "keySignature": "bbb",
        "melodic": {
          "chordScales": [
            "C melodic minor",
            "D dorian b2",
            "Eb lydian augmented",
            "F lydian dominant",
            "G mixolydian b6",
            "A locrian #2",
            "B altered",
          ],
          "chords": [
            "Cm6",
            "Dm7",
            "Eb+maj7",
            "F7",
            "G7",
            "Am7b5",
            "Bm7b5",
          ],
          "chordsHarmonicFunction": [
            "T",
            "SD",
            "T",
            "SD",
            "D",
            "",
            "",
          ],
          "grades": [
            "I",
            "II",
            "bIII",
            "IV",
            "V",
            "VI",
            "VII",
          ],
          "intervals": [
            "1P",
            "2M",
            "3m",
            "4P",
            "5P",
            "6M",
            "7M",
          ],
          "scale": [
            "C",
            "D",
            "Eb",
            "F",
            "G",
            "A",
            "B",
          ],
          "tonic": "C",
          "triads": [
            "Cm",
            "Dm",
            "Ebaug",
            "F",
            "G",
            "Adim",
            "Bdim",
          ],
        },
        "natural": {
          "chordScales": [
            "C minor",
            "D locrian",
            "Eb major",
            "F dorian",
            "G phrygian",
            "Ab lydian",
            "Bb mixolydian",
          ],
          "chords": [
            "Cm7",
            "Dm7b5",
            "Ebmaj7",
            "Fm7",
            "Gm7",
            "Abmaj7",
            "Bb7",
          ],
          "chordsHarmonicFunction": [
            "T",
            "SD",
            "T",
            "SD",
            "D",
            "SD",
            "SD",
          ],
          "grades": [
            "I",
            "II",
            "bIII",
            "IV",
            "V",
            "bVI",
            "bVII",
          ],
          "intervals": [
            "1P",
            "2M",
            "3m",
            "4P",
            "5P",
            "6m",
            "7m",
          ],
          "scale": [
            "C",
            "D",
            "Eb",
            "F",
            "G",
            "Ab",
            "Bb",
          ],
          "tonic": "C",
          "triads": [
            "Cm",
            "Ddim",
            "Eb",
            "Fm",
            "Gm",
            "Ab",
            "Bb",
          ],
        },
        "relativeMajor": "Eb",
        "tonic": "C",
        "type": "minor",
      }
    `);
  });

  test("empty minor key ", () => {
    expect(Key.minorKey("nothing")).toMatchObject({
      type: "minor",
      tonic: "",
    });
    expect(Object.keys(Key.minorKey("C")).sort()).toEqual(
      Object.keys(Key.minorKey("nothing")).sort()
    );
  });
});
