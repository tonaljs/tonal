import Tonal from "./";

describe("Tonal", () => {
  it("exports modules", () => {
    expect(Object.keys(Tonal).sort()).toEqual([
      "Abc",
      "Array",
      "Chord",
      "Detect",
      "Dictionary",
      "Distance",
      "Interval",
      "Key",
      "Note",
      "PCSet",
      "Range",
      "RomanNumeral",
      "Scale"
    ]);
  });
});
