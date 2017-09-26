/* global describe test expect */
var tonal = require("../index");

describe("tonal", () => {
  test("exports", () => {
    expect(Object.keys(tonal)).toEqual([
      "note",
      "interval",
      "distance",
      "key",
      "scale",
      "chord",
      "pcset",
      "dictionary"
    ]);
  });
});
