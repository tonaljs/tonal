import * as Tonal from "./index";

describe("@tonaljs/tonal", () => {
  test("exported modules and functions", () => {
    const exportedNames = Object.keys(Tonal).sort();
    expect(exportedNames).toEqual([
      "AbcNotation",
      "Array",
      "Chord",
      "ChordDictionary",
      "Core",
      "Interval",
      "Key",
      "Midi",
      "Mode",
      "Note",
      "PcSet",
      "Progression",
      "Range",
      "RomanNumeral",
      "Scale",
      "ScaleDictionary",
      "Tonal",
      "accToAlt",
      "altToAcc",
      "coordToInterval",
      "coordToNote",
      "decode",
      "distance",
      "encode",
      "interval",
      "isNamed",
      "isPitch",
      "note",
      "tokenizeInterval",
      "tokenizeNote",
      "transpose"
    ]);
  });
});
