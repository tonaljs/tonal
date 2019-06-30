import { entries, mode } from "./index";

const names = entries().map(m => m.name);

describe("Mode", () => {
  describe("mode", () => {
    test("properties", () => {
      expect(mode("ionian")).toEqual({
        empty: false,
        modeNum: 0,
        name: "ionian",
        setNum: 2773,
        chroma: "101011010101",
        normalized: "101011010101",
        alt: 0,
        triad: "",
        seventh: "Maj7",
        aliases: ["major"],
        intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
      });
      expect(mode("major")).toEqual(mode("ionian"));
    });
    test("accept Named as parameter", () => {
      expect(mode(mode("major"))).toEqual(mode("major"));
      expect(mode({ name: "Major" })).toEqual(mode("major"));
    });
    test("name is case independent", () => {
      expect(mode("Dorian")).toEqual(mode("dorian"));
    });
    test("setNum", () => {
      const pcsets = names.map(name => mode(name).setNum);
      expect(pcsets).toEqual([2773, 2902, 3418, 2741, 2774, 2906, 3434]);
    });

    test("alt", () => {
      const alt = names.map(name => mode(name).alt);
      expect(alt).toEqual([0, 2, 4, -1, 1, 3, 5]);
    });
    test("triad", () => {
      const triads = names.map(name => mode(name).triad);
      expect(triads).toEqual(["", "m", "m", "", "", "m", "dim"]);
    });
    test("seventh", () => {
      const sevenths = names.map(name => mode(name).seventh);
      expect(sevenths).toEqual(["Maj7", "m7", "m7", "Maj7", "7", "m7", "m7b5"]);
    });

    test("aliases", () => {
      expect(mode("major")).toEqual(mode("ionian"));
      expect(mode("minor")).toEqual(mode("aeolian"));
    });
  });
  test("names", () => {
    expect(names).toEqual([
      "ionian",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian"
    ]);
  });
});
