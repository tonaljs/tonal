import { modes } from "../pcset";
import { add, clear, entries, get, keys } from "./index";

describe("gets dictionary", () => {
  test("list names", () => {
    expect(entries()).toHaveLength(88);
    // sorted
    expect(entries()[0].name).toEqual("major pentatonic");
  });

  test("get ", () => {
    expect(get("major")).toEqual({
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
    expect(get("unknown")).toEqual({
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
    expect(get("quinta")).toMatchObject({
      chroma: "100000010000"
    });
    add(["1P", "5P"], "quinta", ["q", "Q"]);
    expect(get("q")).toEqual(get("quinta"));
    expect(get("Q")).toEqual(get("quinta"));
  });

  test("major modes", () => {
    const chromas = modes(get("major").intervals, true);
    const names = chromas.map(chroma => get(chroma).name);
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
    const chromas = modes(get("harmonic minor").intervals, true);
    const names = chromas.map(chroma => get(chroma).name);
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
    const chromas = modes(get("melodic minor").intervals, true);
    const names = chromas.map(chroma => get(chroma).name);
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
