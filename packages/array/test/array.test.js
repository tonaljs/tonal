/* global describe it expect */
const array = require("../index");

describe("tonal-array", () => {
  it("permutations", () => {
    expect(array.permutations(["a", "b", "c"])).toEqual([
      ["a", "b", "c"],
      ["b", "a", "c"],
      ["b", "c", "a"],
      ["a", "c", "b"],
      ["c", "a", "b"],
      ["c", "b", "a"]
    ]);
  });
});
