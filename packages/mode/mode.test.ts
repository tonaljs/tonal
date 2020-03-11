import Mode from "./index";

describe("Mode", () => {
  describe("mode", () => {
    test("properties", () => {
      expect(Mode.get("ionian")).toEqual({
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
      expect(Mode.get("major")).toEqual(Mode.get("ionian"));
    });
    test("accept Named as parameter", () => {
      expect(Mode.get(Mode.get("major"))).toEqual(Mode.get("major"));
      expect(Mode.get({ name: "Major" })).toEqual(Mode.get("major"));
    });
    test("name is case independent", () => {
      expect(Mode.get("Dorian")).toEqual(Mode.get("dorian"));
    });
    test("setNum", () => {
      const pcsets = Mode.names().map(name => Mode.get(name).setNum);
      expect(pcsets).toEqual([2773, 2902, 3418, 2741, 2774, 2906, 3434]);
    });

    test("alt", () => {
      const alt = Mode.names().map(name => Mode.get(name).alt);
      expect(alt).toEqual([0, 2, 4, -1, 1, 3, 5]);
    });
    test("triad", () => {
      const triads = Mode.names().map(name => Mode.get(name).triad);
      expect(triads).toEqual(["", "m", "m", "", "", "m", "dim"]);
    });
    test("seventh", () => {
      const sevenths = Mode.names().map(name => Mode.get(name).seventh);
      expect(sevenths).toEqual(["Maj7", "m7", "m7", "Maj7", "7", "m7", "m7b5"]);
    });

    test("aliases", () => {
      expect(Mode.get("major")).toEqual(Mode.get("ionian"));
      expect(Mode.get("minor")).toEqual(Mode.get("aeolian"));
    });
  });
  test("names", () => {
    expect(Mode.names()).toEqual([
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
