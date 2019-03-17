import Progression from ".";

const $ = str => str.split(" ");

describe.skip("tonal-progression", () => {
  test("concrete", () => {
    expect(Progression.concrete("I IIm7 V7", "C")).toEqual(["C", "Dm7", "G7"]);
    expect(Progression.concrete("Imaj7 2 IIIm7", "C")).toEqual([
      "Cmaj7",
      null,
      "Em7"
    ]);
    expect(Progression.concrete("I II III IV V VI VII", "C")).toEqual([
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "B"
    ]);
    expect(Progression.concrete("bI bII bIII bIV bV bVI bVII", "C")).toEqual([
      "Cb",
      "Db",
      "Eb",
      "Fb",
      "Gb",
      "Ab",
      "Bb"
    ]);
    expect(
      Progression.concrete("#Im7 #IIm7 #III #IVMaj7 #V7 #VI #VIIo", "C")
    ).toEqual(["C#m7", "D#m7", "E#", "F#Maj7", "G#7", "A#", "B#o"]);
  });

  test("abstract", () => {
    expect(Progression.abstract("Cmaj7 Dm7 G7", "C")).toEqual([
      "Imaj7",
      "IIm7",
      "V7"
    ]);
  });

  test("progressions: build roman chord", () => {
    expect(
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(n) {
        return Progression.buildRoman(n);
      })
    ).toEqual(["I", "II", "III", "IV", "V", "VI", "VII", "I", "II"]);
    expect(Progression.buildRoman(2, -1)).toBe("bIII");
    expect(Progression.buildRoman(3, 1, "dim")).toBe("#IVdim");
  });

  test("parseRomanChord", () => {
    expect(Progression.parseRomanChord("V7")).toEqual({
      type: "7",
      root: "5P"
    });
    expect(Progression.parseRomanChord("IIm7")).toEqual({
      type: "m7",
      root: "2M"
    });
    expect(Progression.parseRomanChord("VIIo")).toEqual({
      type: "o",
      root: "7M"
    });
  });
});
