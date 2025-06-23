import { describe, expect, test } from "vitest";
import * as AbcNotation from "./index";

describe("@tonaljs/abc-notation", () => {
  test("tokenize", () => {
    expect(AbcNotation.tokenize("C,',")).toEqual(["", "C", ",',"]);
    expect(AbcNotation.tokenize("g,,'")).toEqual(["", "g", ",,'"]);
    expect(AbcNotation.tokenize("")).toEqual(["", "", ""]);
    expect(AbcNotation.tokenize("m")).toEqual(["", "", ""]);
    expect(AbcNotation.tokenize("c#")).toEqual(["", "", ""]);
  });

  test("transpose", () => {
    expect(AbcNotation.transpose("=C", "P19")).toEqual("g'");
  });
  test("distance", () => {
    expect(AbcNotation.distance("=C", "g")).toEqual("12P");
  });

  test("toNote", () => {
    const ABC = [
      "__A,,",
      "_B,",
      "=C",
      "d",
      "^e'",
      "^^f''",
      "G,,''",
      "g,,,'''",
      "",
    ];
    const SCIENTIFIC = [
      "Abb2",
      "Bb3",
      "C4",
      "D5",
      "E#6",
      "F##7",
      "G4",
      "G5",
      "",
    ];
    expect(ABC.map(AbcNotation.abcToScientificNotation)).toEqual(SCIENTIFIC);
  });

  test("toAbc", () => {
    const SCIENTIFIC = [
      "Abb2",
      "Bb3",
      "C4",
      "D5",
      "E#6",
      "F##7",
      "G#2",
      "Gb7",
      "",
    ];
    const ABC = ["__A,,", "_B,", "C", "d", "^e'", "^^f''", "^G,,", "_g''", ""];
    expect(SCIENTIFIC.map(AbcNotation.scientificToAbcNotation)).toEqual(ABC);
  });
  test("toAbc Octave 0", () => {
    const SCIENTIFIC = ["A0", "Bb0", "C0", "D0", "E#0", "F##0", "G#0"];
    const ABC = [
      "A,,,,",
      "_B,,,,",
      "C,,,,",
      "D,,,,",
      "^E,,,,",
      "^^F,,,,",
      "^G,,,,",
    ];
    expect(SCIENTIFIC.map(AbcNotation.scientificToAbcNotation)).toEqual(ABC);
  });
});
