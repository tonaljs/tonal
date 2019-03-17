import Tonal from "./";

describe("Tonal", () => {
  it("exports modules", () => {
    expect(Object.keys(Tonal).sort()).toEqual([
      "Abc",
      "Array",
      "Chord",
      "ChordDictionary",
      "Detect",
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
