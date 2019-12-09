import * as Modules from "./index";

describe("@tonaljs/modules", () => {
  test("modules count", () => {
    const moduleNames = Object.keys(Modules).sort();
    expect(moduleNames.length).toBe(16);
    expect(moduleNames).toEqual([
      "AbcNotation",
      "Array",
      "Chord",
      "ChordDictionary",
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
      "Tonal"
    ]);
  });
});
