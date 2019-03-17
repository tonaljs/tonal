import Scales from "./";

const S = str => str.split(" ");

describe("Scales dictionary", () => {
  it("list names", () => {
    expect(Scales.names()).toHaveLength(86);
  });

  it("list aliases", () => {
    expect(Scales.aliases()).toHaveLength(110);
  });

  it("get the name from the intervals or chroma", () => {
    expect(Scales.nameOf(S("1P 2M 3M 4P 5P 6M 7M"))).toEqual("major");
    expect(Scales.nameOf("101011010101")).toEqual("major");
    expect(Scales.nameOf("major")).toEqual("major");
    expect(Scales.nameOf("ionian")).toEqual("major");
  });

  it("get aliases of a chord name", () => {
    expect(Scales.aliasesOf("minor blues")).toEqual(["minor blues", "blues"]);
    expect(Scales.aliasesOf("blues")).toEqual(["minor blues", "blues"]);
    expect(Scales.aliasesOf("no scale")).toEqual([]);
  });

  it("get intervals from name", () => {
    expect(Scales.intervalsOf("major")).toEqual(S("1P 2M 3M 4P 5P 6M 7M"));
    expect(Scales.intervalsOf("lydian pentatonic")).toEqual(
      Scales.intervalsOf("chinese")
    );
    expect(Scales.intervalsOf("no scale")).toEqual([]);
  });
});
