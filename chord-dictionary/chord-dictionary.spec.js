import * as Chord from "./";

const $ = arr => arr.join(" ");

describe("Chord dictionary", () => {
  it("list names", () => {
    expect(Chord.names()).toHaveLength(45);
  });
  it("list abbreviations", () => {
    expect(Chord.abbreviations()).toHaveLength(126);
  });
  it("list aliases", () => {
    expect(Chord.aliases()).toHaveLength(228);
  });
  it("get alias of a name", () => {
    expect(Chord.alias("minor")).toEqual(["m", "min", "-"]);
    expect(Chord.alias("-")).toEqual(["m", "min", "-"]);
    expect(Chord.alias("maj13#11")).toEqual([
      "M13#11",
      "maj13#11",
      "M13+4",
      "M13#4"
    ]);
    expect(Chord.alias("no chord")).toEqual([]);
  });
  it("get intervals from name or abbreviation", () => {
    expect($(Chord.intervals("major"))).toEqual("1P 3M 5P");
    expect($(Chord.intervals(""))).toEqual("1P 3M 5P");
    expect($(Chord.intervals("M"))).toEqual("1P 3M 5P");
    expect($(Chord.intervals("maj13#11"))).toEqual("1P 3M 5P 7M 9M 11A 13M");
    expect(Chord.intervals("no chord")).toEqual([]);
  });
});
