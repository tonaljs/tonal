import { add, clear, entries, keys, scaleType } from "./index";

describe("scaleTypes dictionary", () => {
  test("list names", () => {
    expect(entries()).toHaveLength(86);
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

  test("clear dictionary", () => {
    clear();
    expect(entries()).toEqual([]);
    expect(keys()).toEqual([]);
  });
});
