import {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize,
  transpose
} from "./index";

describe("@tonaljs/abc-notation", () => {
  test("tokenize", () => {
    expect(tokenize("C,',")).toEqual(["", "C", ",',"]);
    expect(tokenize("g,,'")).toEqual(["", "g", ",,'"]);
    expect(tokenize("")).toEqual(["", "", ""]);
    expect(tokenize("m")).toEqual(["", "", ""]);
    expect(tokenize("c#")).toEqual(["", "", ""]);
  });

  test("transpose", () => {
    expect(transpose("=C", "P19")).toEqual("g'");
  });

  test("toNote", () => {
    const ABC = ["__A,,", "_B,", "=C", "d", "^e'", "^^f''", "G,,''", "g,,,'''"];
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G4", "G5"];
    expect(ABC.map(abcToScientificNotation)).toEqual(SCIENTIFIC);
  });

  test("toAbc", () => {
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G#2", "Gb7"];
    const ABC = ["__A,,", "_B,", "C", "d", "^e'", "^^f''", "^G,,", "_g''"];
    expect(SCIENTIFIC.map(scientificToAbcNotation)).toEqual(ABC);
  });
});
