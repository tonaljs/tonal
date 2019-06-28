import { abbreviatures, chordType, names } from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/chord-dictionary", () => {
  test("list names", () => {
    expect(names()).toHaveLength(35);
    // sorted
    expect(names()[0]).toEqual("altered");
  });
  test("list abbreviatures", () => {
    expect(abbreviatures()).toHaveLength(199);
    // sorted
    expect(abbreviatures()[0]).toEqual("");
  });
  test("chordType ", () => {
    expect(chordType("major")).toEqual({
      empty: false,
      name: "major",
      quality: "Major",
      intervals: ["1P", "3M", "5P"],
      aliases: ["M", ""],
      num: 2192,
      chroma: "100010010000",
      normalized: "100010010000",
      length: 3
    });
  });
});
