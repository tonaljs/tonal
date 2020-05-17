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
        "C aeolian",
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
      Object {
        "alteration": 0,
        "chordScales": Array [
          "C major",
          "D dorian",
          "E phrygian",
          "F lydian",
          "G mixolydian",
          "A minor",
          "B locrian",
        ],
        "chords": Array [
          "Cmaj7",
          "Dm7",
          "Em7",
          "Fmaj7",
          "G7",
          "Am7",
          "Bm7b5",
        ],
        "chordsHarmonicFunction": Array [
          "CT",
          "DSD",
          "ET",
          "FSD",
          "GD",
          "AT",
          "BD",
        ],
        "grades": Array [
          "I",
          "II",
          "III",
          "IV",
          "V",
          "VI",
          "VII",
        ],
        "intervals": Array [
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
        "scale": Array [
          "C",
          "D",
          "E",
          "F",
          "G",
          "A",
          "B",
        ],
        "secondaryDominants": Array [
          "",
          "A7",
          "B7",
          "C7",
          "D7",
          "E7",
          "",
        ],
        "secondaryDominantsMinorRelative": Array [
          "",
          "Em7b5",
          "F#m7",
          "Gm7",
          "Am7",
          "Bm7b5",
          "",
        ],
        "substituteDominants": Array [
          "",
          "Eb7",
          "F7",
          "Gb7",
          "Ab7",
          "Bb7",
          "",
        ],
        "substituteDominantsMinorRelative": Array [
          "",
          "Em7",
          "Cm7",
          "Dbm7",
          "Am7",
          "Fm7",
          "",
        ],
        "tonic": "C",
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
      Object {
        "alteration": -3,
        "harmonic": Object {
          "chordScales": Array [
            "C harmonic minor",
            "D locrian 6",
            "Eb major augmented",
            "F lydian diminished",
            "G phrygian dominant",
            "Ab lydian #9",
            "B ultralocrian",
          ],
          "chords": Array [
            "CmMaj7",
            "Dm7b5",
            "Eb+maj7",
            "Fm7",
            "G7",
            "Abmaj7",
            "Bo7",
          ],
          "chordsHarmonicFunction": Array [
            "CT",
            "DSD",
            "EbT",
            "FSD",
            "GD",
            "AbSD",
            "BD",
          ],
          "grades": Array [
            "I",
            "II",
            "bIII",
            "IV",
            "V",
            "bVI",
            "VII",
          ],
          "intervals": Array [
            "1P",
            "2M",
            "3m",
            "4P",
            "5P",
            "6m",
            "7M",
          ],
          "scale": Array [
            "C",
            "D",
            "Eb",
            "F",
            "G",
            "Ab",
            "B",
          ],
          "tonic": "C",
        },
        "keySignature": "bbb",
        "melodic": Object {
          "chordScales": Array [
            "C melodic minor",
            "D dorian b2",
            "Eb lydian augmented",
            "F lydian dominant",
            "G mixolydian b6",
            "A locrian #2",
            "B altered",
          ],
          "chords": Array [
            "Cm6",
            "Dm7",
            "Eb+maj7",
            "F7",
            "G7",
            "Am7b5",
            "Bm7b5",
          ],
          "chordsHarmonicFunction": Array [
            "CT",
            "DSD",
            "EbT",
            "FSD",
            "GD",
            "A-",
            "B-",
          ],
          "grades": Array [
            "I",
            "II",
            "bIII",
            "IV",
            "V",
            "VI",
            "VII",
          ],
          "intervals": Array [
            "1P",
            "2M",
            "3m",
            "4P",
            "5P",
            "6M",
            "7M",
          ],
          "scale": Array [
            "C",
            "D",
            "Eb",
            "F",
            "G",
            "A",
            "B",
          ],
          "tonic": "C",
        },
        "natural": Object {
          "chordScales": Array [
            "C minor",
            "D locrian",
            "Eb major",
            "F dorian",
            "G phrygian",
            "Ab lydian",
            "Bb mixolydian",
          ],
          "chords": Array [
            "Cm7",
            "Dm7b5",
            "Ebmaj7",
            "Fm7",
            "Gm7",
            "Abmaj7",
            "Bb7",
          ],
          "chordsHarmonicFunction": Array [
            "CT",
            "DSD",
            "EbT",
            "FSD",
            "GD",
            "AbSD",
            "BbSD",
          ],
          "grades": Array [
            "I",
            "II",
            "bIII",
            "IV",
            "V",
            "bVI",
            "bVII",
          ],
          "intervals": Array [
            "1P",
            "2M",
            "3m",
            "4P",
            "5P",
            "6m",
            "7m",
          ],
          "scale": Array [
            "C",
            "D",
            "Eb",
            "F",
            "G",
            "Ab",
            "Bb",
          ],
          "tonic": "C",
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
