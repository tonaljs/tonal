import { parse, name, tokenize } from "./index";
import { Notation } from "@tonaljs/pitch-notation";

describe("@tonaljs/pitch-scientific-notation", () => {
  test("conforms notation interface", () => {
    const notation: Notation = {
      tokenize,
      parse,
      name,
    };
    expect(notation).toBeDefined();
  });

  test("tokenize", () => {
    expect(tokenize("-2M")).toEqual({
      input: "-2M",
      matched: "-2M",
      number: "-2",
      quality: "M",
      rest: "",
    });
    expect(tokenize("M3")).toEqual({
      input: "M3",
      matched: "M3",
      number: "3",
      quality: "M",
      rest: "",
    });
    expect(tokenize("5Pmaj7")).toEqual({
      input: "5Pmaj7",
      matched: "5P",
      number: "5",
      quality: "P",
      rest: "maj7",
    });
  });

  describe("parse", () => {
    test("has properties", () => {
      expect(parse("4d")).toEqual({
        // valid: true,
        empty: false,
        name: "4d",
        num: 4,
        q: "d",
        type: "perfectable",
        step: 3,
        alt: -1,
        dir: 1,
        oct: 0,
        chroma: 4,
        coord: [-8, 5],
        semitones: 4,
        simple: 4,
      });
    });
  });
});
