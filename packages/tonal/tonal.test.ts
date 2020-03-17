import * as Tonal from "./index";

describe("@tonaljs/tonal", () => {
  test("exported modules and functions", () => {
    const exportedNames = Object.keys(Tonal).sort();
    expect(exportedNames).toEqual([
      "AbcNotation",
      "Array",
      "Chord",
      "ChordDictionary",
      "ChordType",
      "Collection",
      "Core",
      "DurationValue",
      "Interval",
      "Key",
      "Midi",
      "Mode",
      "Note",
      "PcSet", // <- deprecated
      "Pcset",
      "Progression",
      "Range",
      "RomanNumeral",
      "Scale",
      "ScaleDictionary",
      "ScaleType",
      "TimeSignature",
      "Tonal",
      "accToAlt",
      "altToAcc",
      "coordToInterval",
      "coordToNote",
      "decode",
      "deprecate",
      "distance",
      "encode",
      "fillStr",
      "interval",
      "isNamed",
      "isPitch",
      "note",
      "stepToLetter",
      "tokenizeInterval",
      "tokenizeNote",
      "transpose"
    ]);
  });
});
