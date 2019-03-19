import Chords from "./";
import data from "./chord-data";

const $ = str => str.split(" ");

describe("Chord dictionary", () => {
  it("get all chords", () => {
    expect(Chords.all()).toHaveLength(111);
    expect(Chords.all()[0].name).toEqual("altered");
  });

  test("props", () => {
    expect(Chords.find("major")).toEqual({
      name: "major",
      quality: "Major",
      abbreviatures: ["M", ""],
      chroma: "100010010000",
      intervals: ["1P", "3M", "5P"],
      setnum: 2192
    });
  });

  it("has quality", () => {
    const chords = ["M", "m", "o", "+5"];
    const qualities = chords.map(Chords.find).map(c => c.quality);
    expect(qualities).toEqual(["Major", "Minor", "Diminished", "Augmented"]);
  });

  it("finds chords", () => {
    const major = Chords.find({ name: "major" });
    expect(Chords.find({ abbreviature: "M" })).toBe(major);
    expect(Chords.find({ abbreviature: "" })).toBe(major);
    expect(Chords.find({ chroma: "100010010000" })).toBe(major);
    expect(Chords.find({ setnum: 2192 })).toBe(major);
    expect(Chords.find({ intervals: ["1P", "3M", "5P"] })).toBe(major);

    expect(Chords.find("major")).toBe(major);
    expect(Chords.find("M")).toBe(major);
    expect(Chords.find("")).toBe(major);
    expect(Chords.find("100010010000")).toBe(major);
    expect(Chords.find(2192)).toBe(major);
  });
});
