import ChordDictionary from "./index";
import ChordType from "@tonaljs/chord-type";

describe("@tonaljs/chord-dictionary", () => {
  test("alias of ChordType", () => {
    expect(ChordDictionary).toEqual(ChordType);
  });
});
