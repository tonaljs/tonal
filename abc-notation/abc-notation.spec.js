import * as Abc from "./";

describe("abc notation", () => {
  test("tokenize", () => {
    expect(Abc.tokenize("C,',")).toEqual(["", "C", ",',"]);
    expect(Abc.tokenize("g,,'")).toEqual(["", "g", ",,'"]);
    expect(Abc.tokenize()).toEqual(["", "", ""]);
    expect(Abc.tokenize("m")).toEqual(["", "", ""]);
    expect(Abc.tokenize("c#")).toEqual(["", "", ""]);
  });

  test("toNote", () => {
    const ABC = ["__A,,", "_B,", "=C", "d", "^e'", "^^f''", "G,,''", "g,,,'''"];
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G4", "G5"];
    expect(ABC.map(Abc.toNote)).toEqual(SCIENTIFIC);
  });

  test("toAbc", () => {
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G#2", "Gb7"];
    const ABC = ["__A,,", "_B,", "C", "d", "^e'", "^^f''", "^G,,", "_g''"];
    expect(SCIENTIFIC.map(Abc.toAbc)).toEqual(ABC);
  });
});
