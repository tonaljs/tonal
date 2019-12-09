import { modes } from "../pcset";
import { add, clear, entries, keys, scaleType } from "./index";

describe("scaleTypes dictionary", () => {
  test("list names", () => {
    expect(entries()).toHaveLength(88);
    // sorted
    expect(entries()[0].name).toEqual("major pentatonic");
  });

  test("scaleType ", () => {
    expect(scaleType("major")).toEqual({
      empty: false,
      setNum: 2773,
      name: "major",
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      aliases: ["ionian"],
      chroma: "101011010101",
      normalized: "101010110101"
    });
  });

  test("not valid scaleType type", () => {
    expect(scaleType("unknown")).toEqual({
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
    add(["1P", "5P"], "quinta");
    expect(scaleType("quinta")).toMatchObject({
      chroma: "100000010000"
    });
    add(["1P", "5P"], "quinta", ["q", "Q"]);
    expect(scaleType("q")).toEqual(scaleType("quinta"));
    expect(scaleType("Q")).toEqual(scaleType("quinta"));
  });

  test("major modes", () => {
    const chromas = modes(scaleType("major").intervals, true);
    const names = chromas.map(chroma => scaleType(chroma).name);
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
    const chromas = modes(scaleType("harmonic minor").intervals, true);
    const names = chromas.map(chroma => scaleType(chroma).name);
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
    const chromas = modes(scaleType("melodic minor").intervals, true);
    const names = chromas.map(chroma => scaleType(chroma).name);
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
    clear();
    expect(entries()).toEqual([]);
    expect(keys()).toEqual([]);
  });
});
