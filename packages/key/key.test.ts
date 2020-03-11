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
  test("keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(
      tonics.map(tonic => Key.majorKey(tonic).keySignature).join(" ")
    ).toEqual(" ## #### b # ### #####");
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
});
