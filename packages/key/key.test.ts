// tslint:disable-next-line: no-implicit-dependencies
import { scale } from "@tonaljs/scale";
import { majorKey, majorTonicFromKeySignature, minorKey } from "./index";

describe("@tonal/key", () => {
  test("fromAlter", () => {
    expect(majorTonicFromKeySignature("###")).toEqual("A");
    expect(majorTonicFromKeySignature(3)).toEqual("A");
    expect(majorTonicFromKeySignature("b")).toEqual("F");
    expect(majorTonicFromKeySignature("bb")).toEqual("Bb");
    expect(majorTonicFromKeySignature("other")).toEqual(null);
  });
  test("keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(tonics.map(tonic => majorKey(tonic).keySignature).join(" ")).toEqual(
      " ## #### b # ### #####"
    );
  });
  describe("scale names", () => {
    test("natural scales", () => {
      const chordScales = minorKey("C").natural.chordScales;
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
      const chordScales = minorKey("C").harmonic.chordScales;
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
      const chordScales = minorKey("C").melodic.chordScales;
      expect(chordScales.map(scale).map(scale => scale.name)).toEqual([
        "C melodic minor",
        "D neopolitan major",
        "Eb lydian augmented",
        "F lydian dominant",
        "G mixolydian b6",
        "A locrian #2",
        "B altered"
      ]);
    });
  });
});
