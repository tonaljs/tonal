import { chordType, entries } from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/chord-dictionary", () => {
  test("list names", () => {
    expect(entries()).toHaveLength(110);
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
});
