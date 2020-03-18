import ChordType from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/chord-type", () => {
  test("names", () => {
    // sorted
    expect(ChordType.names().slice(0, 5)).toEqual([
      "fifth",
      "suspended 4th",
      "suspended 4th seventh",
      "augmented",
      "major seventh b6"
    ]);
  });

  test("symbols", () => {
    // sorted
    expect(ChordType.symbols().slice(0, 3)).toEqual([
      "5",
      "M7#5sus4",
      "7#5sus4"
    ]);
  });

  test("all", () => {
    expect(ChordType.all()).toHaveLength(108);
  });

  test("get ", () => {
    expect(ChordType.get("major")).toEqual({
      empty: false,
      setNum: 2192,
      name: "major",
      quality: "Major",
      intervals: ["1P", "3M", "5P"],
      aliases: ["M", ""],
      chroma: "100010010000",
      normalized: "100001000100"
    });
  });

  test("add a chord", () => {
    ChordType.add(["1P", "5P"], ["q"]);
    expect(ChordType.get("q")).toMatchObject({
      chroma: "100000010000"
    });
    ChordType.add(["1P", "5P"], ["q"], "quinta");
    expect(ChordType.get("quinta")).toEqual(ChordType.get("q"));
  });

  test("clear dictionary", () => {
    ChordType.removeAll();
    expect(ChordType.all()).toEqual([]);
    expect(ChordType.keys()).toEqual([]);
  });
});
