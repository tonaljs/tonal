import { note, tokenizeNote as tokenize } from "../index";

describe("note", () => {
  test("tokenize", () => {
    expect(tokenize("Cbb5 major")).toEqual(["C", "bb", "5", "major"]);
    expect(tokenize("Ax")).toEqual(["A", "##", "", ""]);
    expect(tokenize("CM")).toEqual(["C", "", "", "M"]);
    expect(tokenize("maj7")).toEqual(["", "", "", "maj7"]);
    expect(tokenize("")).toEqual(["", "", "", ""]);
    expect(tokenize("bb")).toEqual(["B", "b", "", ""]);
    expect(tokenize("##")).toEqual(["", "##", "", ""]);
  });

  describe("note properties from string", () => {
    test("properties", () => {
      expect(note("A4")).toEqual({
        empty: false,
        name: "A4",
        letter: "A",
        acc: "",
        pc: "A",
        step: 5,
        alt: 0,
        oct: 4,
        coord: [3, 3],
        height: 69,
        chroma: 9,
        midi: 69,
        freq: 440
      });
    });

    test("it accepts a Note as param", () => {
      expect(note(note("C4"))).toEqual(note("C4"));
    });

    test("height", () => {
      const height = (str: string) => str.split(" ").map(n => note(n).height);
      expect(height("C4 D4 E4 F4 G4")).toEqual([60, 62, 64, 65, 67]);
      expect(height("B-2 C-1 D-1")).toEqual([-1, 0, 2]);
      expect(height("F9 G9 A9")).toEqual([125, 127, 129]);
      expect(height("C-4 D-4 E-4 F-4 G-4")).toEqual([-36, -34, -32, -31, -29]);
      expect(height("C D E F G")).toEqual([-1188, -1186, -1184, -1183, -1181]);
    });

    test("midi", () => {
      const midi = (str: string) => str.split(" ").map(n => note(n).midi);
      expect(midi("C4 D4 E4 F4 G4")).toEqual([60, 62, 64, 65, 67]);
      expect(midi("B-2 C-1 D-1")).toEqual([null, 0, 2]);
      expect(midi("F9 G9 A9")).toEqual([125, 127, null]);
      expect(midi("C-4 D-4 E-4 F-4")).toEqual([null, null, null, null]);
      expect(midi("C D E F")).toEqual([null, null, null, null]);
    });
    test("freq", () => {
      expect(note("C4").freq).toEqual(261.6255653005986);
      expect(note("B-2").freq).toEqual(7.716926582126941);
      expect(note("F9").freq).toEqual(11175.303405856126);
      expect(note("C-4").freq).toEqual(1.0219748644554634);
      expect(note("C").freq).toEqual(null);
      expect(note("x").freq).toEqual(undefined);
    });
  });

  test("note properties from pitch properties", () => {
    expect(note({ step: 1, alt: -1 }).name).toBe("Db");
    expect(note({ step: 2, alt: 1 }).name).toBe("E#");
    expect(note({ step: 2, alt: 1, oct: 4 }).name).toBe("E#4");
    expect(note({ step: 5, alt: 0 }).name).toBe("A");
    expect(note({ step: -1, alt: 0 }).name).toBe("");
    expect(note({ step: 8, alt: 0 }).name).toBe("");
  });
});
