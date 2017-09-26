/* global describe test expect */
var tertian = require("..");

describe("tonal-scale", () => {
  test("tertian: intervals", () => {
    expect(tertian.intervals("mm")).toEqual(["1P", "3m", "5d"]);
    expect(tertian.intervals("Mm")).toEqual(["1P", "3M", "5P"]);
    expect(tertian.intervals("Mmm")).toEqual(["1P", "3M", "5P", "7m"]);
  });

  test("tertian: permutations", () => {
    expect(tertian.allFor("mmMM")).toEqual([
      "MMmm",
      "MmMm",
      "MmmM",
      "mMMm",
      "mMmM",
      "mmMM"
    ]);

    expect(
      tertian
        .allFor("mmMM")
        .map(tertian.intervals)
        .map(i => i.join(" "))
    ).toEqual([
      "1P 3M 5A 7M 9M",
      "1P 3M 5P 7M 9M",
      "1P 3M 5P 7m 9M",
      "1P 3m 5P 7M 9M",
      "1P 3m 5P 7m 9M",
      "1P 3m 5d 7m 9M"
    ]);
  });
});
