import { add, chordType, clear, entries, keys } from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/chord-dictionary", () => {
  test("list names", () => {
    expect(entries()).toHaveLength(109);
    // sorted
    expect(entries()[0].name).toEqual("fifth");
  });

  test("chordType ", () => {
    expect(chordType("major")).toEqual({
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
    add(["1P", "5P"], ["q"]);
    expect(chordType("q")).toMatchObject({
      chroma: "100000010000"
    });
    add(["1P", "5P"], ["q"], "quinta");
    expect(chordType("quinta")).toEqual(chordType("q"));
  });

  test("clear dictionary", () => {
    clear();
    expect(entries()).toEqual([]);
    expect(keys()).toEqual([]);
  });
});
