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
      "PcSet",
      "Dictionary",
      "transpose",
      "interval",
      "note",
      "midi",
      "freq",
      "chord",
      "scale"
    ]);
  });
});
