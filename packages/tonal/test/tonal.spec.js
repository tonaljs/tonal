/* global describe test expect */
var tonal = require("../index");

describe("tonal", () => {
  test("exports", () => {
    expect(Object.keys(tonal)).toEqual([
      "array",
      "note",
      "interval",
      "distance",
      "key",
      "scale",
      "chord",
      "pcset",
      "default"
    ]);
  });
});
