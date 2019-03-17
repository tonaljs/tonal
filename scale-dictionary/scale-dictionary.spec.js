import Scales from "./";

const $ = str => str.split(" ");

describe("Scales dictionary", () => {
  it("list names", () => {
    expect(Scales.names()).toHaveLength(86);
    expect(Scales.names()[0]).toEqual("aeolian");
  });

  it("list aliases", () => {
    expect(Scales.aliases()).toHaveLength(110);
    expect(Scales.aliases()[0]).toEqual("aeolian");
  });

  it("get the name from the intervals or chroma", () => {
    expect(Scales.getScale($("1P 2M 3M 4P 5P 6M 7M")).name).toEqual("major");
    expect(Scales.getScale("101011010101").name).toEqual("major");
    expect(Scales.getScale("major").name).toEqual("major");
    expect(Scales.getScale("ionian").name).toEqual("major");
  });

  it("get aliases of a chord name", () => {
    expect(Scales.getScale("minor blues").names).toEqual([
      "minor blues",
      "blues"
    ]);
    expect(Scales.getScale("blues").names).toEqual(["minor blues", "blues"]);
    expect(Scales.getScale("no scale").names).toEqual([]);
  });

  it("get intervals from name", () => {
    expect(Scales.getScale("major").intervals).toEqual(
      $("1P 2M 3M 4P 5P 6M 7M")
    );
    expect(Scales.getScale("lydian pentatonic").intervals).toEqual(
      Scales.getScale("chinese").intervals
    );
    expect(Scales.getScale("no scale").intervals).toEqual([]);
  });
});
