import { aliases, names, scaleType } from "./index";

describe("scaleTypes dictionary", () => {
  test("list names", () => {
    expect(names()).toHaveLength(86);
    // sorted
    expect(names()[0]).toEqual("aeolian");
  });

  test("aliases names", () => {
    expect(aliases()).toHaveLength(24);
    // sorted
    expect(aliases()[0]).toEqual("arabian");
  });

  test("scaleType ", () => {
    expect(scaleType("major")).toEqual({
      empty: false,
      num: 2773,
      name: "major",
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      aliases: ["ionian"],
      chroma: "101011010101",
      normalized: "101011010101",
      length: 7
    });
  });

  test("not valid scaleType type", () => {
    expect(scaleType("unknown")).toEqual({
      empty: true,
      name: "",
      num: 0,
      aliases: [],
      chroma: "000000000000",
      intervals: [],
      length: 0,
      normalized: "000000000000"
    });
  });
});
