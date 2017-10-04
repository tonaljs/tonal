/* global describe test expect */
var tonal = require("../index");

describe("tonal", () => {
  test("exports", () => {
    expect(Object.keys(tonal)).toEqual([
      "Array",
      "Note",
      "Interval",
      "Distance",
      "Scale",
      "Chord",
      "PcSet",
      "note",
      "transpose",
      "interval"
    ]);
  });
});
