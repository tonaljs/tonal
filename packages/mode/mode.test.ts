import Mode from "./index";

describe("Mode", () => {
  describe("mode", () => {
    test("properties", () => {
      expect(Mode.properties("ionian")).toEqual({
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
      expect(Mode.properties("major")).toEqual(Mode.properties("ionian"));
    });
    test("accept Named as parameter", () => {
      expect(Mode.properties(Mode.properties("major"))).toEqual(
        Mode.properties("major")
      );
      expect(Mode.properties({ name: "Major" })).toEqual(
        Mode.properties("major")
      );
    });
    test("name is case independent", () => {
      expect(Mode.properties("Dorian")).toEqual(Mode.properties("dorian"));
    });
    test("setNum", () => {
      const pcsets = Mode.names().map(name => Mode.properties(name).setNum);
      expect(pcsets).toEqual([2773, 2902, 3418, 2741, 2774, 2906, 3434]);
    });

    test("alt", () => {
      const alt = Mode.names().map(name => Mode.properties(name).alt);
      expect(alt).toEqual([0, 2, 4, -1, 1, 3, 5]);
    });
    test("triad", () => {
      const triads = Mode.names().map(name => Mode.properties(name).triad);
      expect(triads).toEqual(["", "m", "m", "", "", "m", "dim"]);
    });
    test("seventh", () => {
      const sevenths = Mode.names().map(name => Mode.properties(name).seventh);
      expect(sevenths).toEqual(["Maj7", "m7", "m7", "Maj7", "7", "m7", "m7b5"]);
    });

    test("aliases", () => {
      expect(Mode.properties("major")).toEqual(Mode.properties("ionian"));
      expect(Mode.properties("minor")).toEqual(Mode.properties("aeolian"));
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
