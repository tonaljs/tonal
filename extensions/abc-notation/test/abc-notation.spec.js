import * as abc from "../index";

describe("abc notation", () => {
  test("tokenize", () => {
    expect(abc.tokenize("C,',")).toEqual(["", "C", ",',"]);
    expect(abc.tokenize("g,,'")).toEqual(["", "g", ",,'"]);
    expect(abc.tokenize()).toEqual(["", "", ""]);
    expect(abc.tokenize("m")).toEqual(["", "", ""]);
    expect(abc.tokenize("c#")).toEqual(["", "", ""]);
  });

  test("toNote", () => {
    const ABC = ["__A,,", "_B,", "=C", "d", "^e'", "^^f''", "G,,''", "g,,,'''"];
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G4", "G5"];
    expect(ABC.map(abc.toNote)).toEqual(SCIENTIFIC);
  });

  test("toAbc", () => {
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G#2", "Gb7"];
    const ABC = ["__A,,", "_B,", "C", "d", "^e'", "^^f''", "^G,,", "_g''"];
    expect(SCIENTIFIC.map(abc.toAbc)).toEqual(ABC);
  });
});
