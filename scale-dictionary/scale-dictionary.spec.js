import * as Scale from "./";

const $ = arr => arr.join(" ");

describe("Scale dictionary", () => {
  it("list names", () => {
    expect(Scale.names()).toHaveLength(86);
  });
  it("list aliases", () => {
    expect(Scale.aliases()).toHaveLength(109);
  });
  it("get alias of a name", () => {
    expect(Scale.alias("minor blues")).toEqual(["minor blues", "blues"]);
    expect(Scale.alias("blues")).toEqual(["minor blues", "blues"]);
    expect(Scale.alias("no scale")).toEqual([]);
  });
  it("get intervals from name", () => {
    expect($(Scale.intervals("major"))).toEqual("1P 2M 3M 4P 5P 6M 7M");
    expect(Scale.intervals("lydian pentatonic")).toEqual(
      Scale.intervals("chinese")
    );
    expect(Scale.intervals("no scale")).toEqual([]);
  });
});
