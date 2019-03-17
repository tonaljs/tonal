import Tonal from "./";

describe("Tonal", () => {
  it("exports modules", () => {
    expect(Object.keys(Tonal).sort()).toEqual([
      "Array",
      "Chord",
      "ChordDictionary",
      "Distance",
      "Interval",
      "Key",
      "Note",
      "Pcset",
      "RomanNumeral",
      "Scale",
      "ScaleDictionary"
    ]);
  });
});
