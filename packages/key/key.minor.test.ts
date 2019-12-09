import { minorKey } from "./index";

describe("@tonal/key", () => {
  test("keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(tonics.map(tonic => minorKey(tonic).keySignature).join(" ")).toEqual(
      "bbb b # bbbb bb  ##"
    );
  });

  test("majorKey", () => {
    expect(minorKey("C")).toMatchInlineSnapshot(`
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
