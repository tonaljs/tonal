/* global describe test expect */
var tonal = require("../index");

describe("tonal", () => {
  test("Modules", () => {
    expect(Object.keys(tonal)).toEqual([
      "Array",
      "Note",
      "Interval",
      "Distance",
      "Scale",
      "Chord",
      "PcSet"
    ]);
  });
  test("function aliases", () => {
    expect(Object.keys(tonal)).toEqual([
      "note",
      "transpose",
      "interval",
      "freq",
      "midi"
    ]);
  });
});
