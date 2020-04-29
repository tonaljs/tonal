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
    expect(tokenize("Cbb5 major")).toEqual({
      input: "Cbb5 major",
      matched: "Cbb5",
      rest: "major",
      accidentals: "bb",
      letter: "C",
      octave: "5",
    });
    expect(tokenize("ax")).toEqual({
      input: "ax",
      matched: "ax",
      accidentals: "##",
      letter: "A",
      octave: "",
      rest: "",
    });
    expect(tokenize("cM")).toEqual({
      input: "cM",
      matched: "c",
      letter: "C",
      accidentals: "",
      octave: "",
      rest: "M",
    });
    expect(tokenize("maj7")).toMatchObject({
      matched: "",
      rest: "maj7",
    });
    expect(tokenize("")).toMatchObject({
      rest: "",
      matched: "",
    });
    expect(tokenize("bb")).toMatchObject({
      matched: "bb",
      letter: "B",
      accidentals: "b",
      rest: "",
    });
    expect(tokenize("##")).toEqual({
      input: "##",
      matched: "##",
      letter: "",
      accidentals: "##",
      octave: "",
      rest: "",
    });
  });

  describe("parse", () => {
    test("properties", () => {
      expect(parse("A4")).toEqual({
        // valid: true,
        empty: false,
        name: "A4",
        pc: "A",
        letter: "A",
        accidentals: "",
        octave: "4",
        acc: "",
        step: 5,
        alt: 0,
        oct: 4,
        coord: [3, 3],
        height: 57,
        chroma: 9,
        midi: 69,
        freq: 440,
      });
    });

    test("empty", () => {
      expect(parse("")).toEqual({
        acc: "",
        accidentals: "",
        coord: [],
        empty: true,
        letter: "",
        name: "",
        octave: "",
        pc: "",
      });
    });

    test("height", () => {
      const height = (str: string) =>
        str
          .split(" ")
          .map((n) => parse(n).height)
          .map((height) => (height === undefined ? height : height + 12)); // breaking change from 3 to 4

      expect(height("C4 D4 E4 F4 G4")).toEqual([60, 62, 64, 65, 67]);
      expect(height("B-2 C-1 D-1")).toEqual([-1, 0, 2]);
      expect(height("F9 G9 A9")).toEqual([125, 127, 129]);
      expect(height("C-4 D-4 E-4 F-4 G-4")).toEqual([-36, -34, -32, -31, -29]);
      expect(height("C D E F G")).toEqual([-1188, -1186, -1184, -1183, -1181]);
    });

    test("midi", () => {
      const midi = (str: string) => str.split(" ").map((n) => parse(n).midi);
      expect(midi("C4 D4 E4 F4 G4")).toEqual([60, 62, 64, 65, 67]);
      expect(midi("B-2 C-1 D-1")).toEqual([null, 0, 2]);
      expect(midi("F9 G9 A9")).toEqual([125, 127, null]);
      expect(midi("C-4 D-4 E-4 F-4")).toEqual([null, null, null, null]);
      expect(midi("C D E F")).toEqual([null, null, null, null]);
    });
    test("freq", () => {
      expect(parse("C4").freq).toEqual(261.6255653005986);
      expect(parse("B-2").freq).toEqual(7.716926582126941);
      expect(parse("F9").freq).toEqual(11175.303405856126);
      expect(parse("C-4").freq).toEqual(1.0219748644554634);
      expect(parse("C").freq).toEqual(null);
      expect(parse("x").freq).toEqual(undefined);
    });
  });

  test("note properties from pitch properties", () => {
    expect(name({ step: 1, alt: -1 })).toBe("Db");
    expect(name({ step: 2, alt: 1 })).toBe("E#");
    expect(name({ step: 2, alt: 1, oct: 4 })).toBe("E#4");
    expect(name({ step: 5, alt: 0 })).toBe("A");
    expect(name({ step: -1, alt: 0 })).toBe("");
    expect(name({ step: 8, alt: 0 })).toBe("");
  });
});
