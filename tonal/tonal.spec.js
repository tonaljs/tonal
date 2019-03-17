import Tonal from "./";

describe("Tonal", () => {
  it("exports modules", () => {
    expect(Object.keys(Tonal).sort()).toEqual([
      "AbcNotation",
      "Array",
      "Chord",
      "ChordDictionary",
      "Distance",
      "Interval",
      "Key",
      "Note",
      "PcSet",
      "Range",
      "RomanNumeral",
      "Scale",
      "ScaleDictionary"
    ]);
  });
});
