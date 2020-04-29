import {
  tokenize,
  parse,
  name,
  abcToScientificNotation,
  scientificToAbcNotation,
} from "./index";
import { Notation } from "@tonaljs/pitch-notation";
import Scientific from "@tonaljs/pitch-notation-scientific";

describe("@tonaljs/pitch-notation-abc", () => {
  test("conforms notation interface", () => {
    const notation: Notation = {
      tokenize,
      parse,
      name,
    };
    expect(notation).toBeDefined();
  });

  test("tokenize", () => {
    expect(tokenize("^^C,',")).toEqual({
      input: "^^C,',",
      matched: "^^C,',",
      rest: "",
      accidentals: "^^",
      letter: "C",
      octave: ",',",
    });
    expect(tokenize("_g,,'")).toEqual({
      input: "_g,,'",
      matched: "_g,,'",
      rest: "",
      accidentals: "_",
      letter: "g",
      octave: ",,'",
    });
    expect(tokenize("=C,',maj7")).toEqual({
      input: "=C,',maj7",
      matched: "=C,',",
      letter: "C",
      accidentals: "=",
      octave: ",',",
      rest: "maj7",
    });
  });

  test("parse", () => {
    expect(parse("^^C,',")).toEqual({
      name: "^^C,',",
      scientificName: "C##3",
      letter: "C",
      accidentals: "^^",
      octave: ",',",
      acc: "^^",
      step: 0,
      alt: 2,
      oct: 3,
      chroma: 2,
      coord: [14, -5],
      dir: undefined,
      empty: false,
      freq: 146.8323839587038,
      height: 38,
      midi: 50,
      pc: "",
    });
    expect(parse("G")).toMatchObject({
      letter: "G",
      scientificName: "G4",
    });
    expect(parse("g")).toMatchObject({
      letter: "g",
      scientificName: "G5",
    });
    expect(parse("")).toEqual({
      ...Scientific.parse(""),
      scientificName: "",
    });
  });

  test("name", () => {
    expect(name({ step: 1, alt: 0, oct: 3 })).toEqual("D,");
    expect(name({ step: 4, alt: 1 })).toEqual("");
  });

  test("abcToScientificNotation", () => {
    const ABC = ["__A,,", "_B,", "=C", "d", "^e'", "^^f''", "G,,''", "g,,,'''"];
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G4", "G5"];
    expect(ABC.map(abcToScientificNotation)).toEqual(SCIENTIFIC);
  });

  test("scientificToAbcNotation", () => {
    const SCIENTIFIC = ["Abb2", "Bb3", "C4", "D5", "E#6", "F##7", "G#2", "Gb7"];
    const ABC = ["__A,,", "_B,", "C", "d", "^e'", "^^f''", "^G,,", "_g''"];
    expect(SCIENTIFIC.map(scientificToAbcNotation)).toEqual(ABC);
  });
});
