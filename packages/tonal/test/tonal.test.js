/* global describe test expect */
var tonal = require("../index");

describe("tonal", () => {
  test("exports", () => {
    expect(Object.keys(tonal).length).toBe(34);
    Object.keys(tonal).forEach(function(name) {
      expect(tonal[name]).not.toBe(undefined);
    });
  });
});
