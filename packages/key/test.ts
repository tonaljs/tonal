// tslint:disable-next-line: no-implicit-dependencies
import { get as scale } from "@tonaljs/scale";
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
      tonics.map(tonic => Key.majorKey(tonic).keySignature).join(" ")
    ).toEqual(" ## #### b # ### #####");
  });

  test("minor keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(
      tonics.map(tonic => Key.minorKey(tonic).keySignature).join(" ")
    ).toEqual("bbb b # bbbb bb  ##");
  });

  describe("scale names", () => {
    test("natural scales", () => {
      const chordScales = Key.minorKey("C").natural.chordScales;
      expect(chordScales.map(scale).map(scale => scale.name)).toEqual([
        "C aeolian",
        "D locrian",
        "Eb major",
        "F dorian",
        "G phrygian",
        "Ab lydian",
        "Bb mixolydian"
      ]);
    });

    test("harmonic scales", () => {
      const chordScales = Key.minorKey("C").harmonic.chordScales;
      expect(chordScales.map(scale).map(scale => scale.name)).toEqual([
        "C harmonic minor",
        "D locrian 6",
        "Eb major augmented",
        "F lydian diminished",
        "G phrygian dominant",
        "Ab lydian #9",
        "B ultralocrian"
      ]);
    });
    test("melodic scales", () => {
      const chordScales = Key.minorKey("C").melodic.chordScales;
      expect(chordScales.map(scale).map(scale => scale.name)).toEqual([
        "C melodic minor",
        "D dorian b2",
        "Eb lydian augmented",
        "F lydian dominant",
        "G mixolydian b6",
        "A locrian #2",
        "B altered"
      ]);
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
          "T",
          "SD",
          "T",
          "SD",
          "D",
          "T",
          "D",
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
          "DVI7",
          "EVII7",
          "FI7",
          "GII7",
          "AIII7",
          "",
        ],
        "secondaryDominantsMinorRelative": Array [
          "",
          "DIIIm7b5",
          "EIV#m7",
          "FVm7",
          "GVIm7",
          "AVIIm7b5",
          "",
        ],
        "substituteDominants": Array [
          "",
          "DbIII7",
          "EIV7",
          "FbV7",
          "GbVI7",
          "AbVII7",
          "",
        ],
        "substituteDominantsMinorRelative": Array [
          "",
          "DIIIm7",
          "EIm7",
          "FIIbm7",
          "GVIm7",
          "AIVm7",
          "",
        ],
        "tonic": "C",
        "type": "major",
      }
    `);
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
            "Cmmaj7",
            "Dm7b5",
            "Eb+maj7",
            "Fm7",
            "G7",
            "Abmaj7",
            "Bmo7",
          ],
          "chordsHarmonicFunction": Array [
            "T",
            "SD",
            "T",
            "SD",
            "D",
            "SD",
            "D",
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
            "T",
            "SD",
            "T",
            "SD",
            "D",
            "-",
            "-",
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
            "T",
            "SD",
            "T",
            "SD",
            "D",
            "SD",
            "SD",
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
});
