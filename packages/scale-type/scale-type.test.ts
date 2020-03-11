import { modes } from "@tonaljs/pcset";
import ScaleType from "./index";

describe("gets dictionary", () => {
  test("list names", () => {
    expect(ScaleType.all()).toHaveLength(88);
    // sorted
    expect(ScaleType.all()[0].name).toEqual("major pentatonic");
  });

  test("get ", () => {
    expect(ScaleType.get("major")).toEqual({
      empty: false,
      setNum: 2773,
      name: "major",
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      aliases: ["ionian"],
      chroma: "101011010101",
      normalized: "101010110101"
    });
  });

  test("not valid get type", () => {
    expect(ScaleType.get("unknown")).toEqual({
      empty: true,
      name: "",
      setNum: 0,
      aliases: [],
      chroma: "000000000000",
      intervals: [],
      normalized: "000000000000"
    });
  });

  test("add a chord type", () => {
    ScaleType.add(["1P", "5P"], "quinta");
    expect(ScaleType.get("quinta")).toMatchObject({
      chroma: "100000010000"
    });
    ScaleType.add(["1P", "5P"], "quinta", ["q", "Q"]);
    expect(ScaleType.get("q")).toEqual(ScaleType.get("quinta"));
    expect(ScaleType.get("Q")).toEqual(ScaleType.get("quinta"));
  });

  test("major modes", () => {
    const chromas = modes(ScaleType.get("major").intervals, true);
    const names = chromas.map(chroma => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "major",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian"
    ]);
  });
  test("harmonic minor modes", () => {
    const chromas = modes(ScaleType.get("harmonic minor").intervals, true);
    const names = chromas.map(chroma => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "harmonic minor",
      "locrian 6",
      "major augmented",
      "dorian #4",
      "phrygian dominant",
      "lydian #9",
      "ultralocrian"
    ]);
  });
  test("melodic minor modes", () => {
    const chromas = modes(ScaleType.get("melodic minor").intervals, true);
    const names = chromas.map(chroma => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "melodic minor",
      "dorian b2",
      "lydian augmented",
      "lydian dominant",
      "mixolydian b6",
      "locrian #2",
      "altered"
    ]);
  });

  test("clear dictionary", () => {
    ScaleType.removeAll();
    expect(ScaleType.all()).toEqual([]);
    expect(ScaleType.keys()).toEqual([]);
  });
});
