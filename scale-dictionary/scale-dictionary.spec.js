import Scales from "./";

const $ = str => str.split(" ");

describe("Scales dictionary", () => {
  it("list names", () => {
    expect(Scales.all()).toHaveLength(86);
    expect(Scales.all()[0].name).toEqual("aeolian");
  });

  it("finds a scale", () => {
    expect(Scales.find({ name: "aeolian" })).toEqual({
      chroma: "101101011010",
      intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7m"],
      name: "aeolian",
      names: ["aeolian", "minor"],
      setnum: 2906
    });
    expect(
      Scales.find({
        intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7m"]
      })
    ).toBe(Scales.find("aeolian"));
    expect(Scales.find({ name: "aeolian" })).toBe(Scales.find("aeolian"));
    expect(Scales.find("minor")).toBe(Scales.find("aeolian"));
    expect(Scales.find("101101011010")).toBe(Scales.find("aeolian"));
    expect(Scales.find($("1P 2M 3M 4P 5P 6M 7M"))).toBe(Scales.find("major"));
  });
});
