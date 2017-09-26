/* global describe test expect */
var dft = require("..");

describe("tonal-pcset-dft", () => {
  test("pcset", () => {
    expect(dft.pcset("C4 E4 G#4")).toEqual(["0", "4", "8"]);
  });

  test("components", () => {
    expect(dft.dft("C4 E4 G#4")).toEqual([
      [3, 0],
      [0, 0],
      [0, 0],
      [3, 0],
      [0, 0],
      [0, 0],
      [3, 0]
    ]);
  });

  test("spectra", () => {
    expect(dft.spectra("C4 E4 G#4")).toEqual([3, 0, 0, 3, 0, 0, 3]);
  });

  test("distance", () => {
    expect(dft.distance("C E G", "C Eb G")).toBe(1.5307337294603596);
  });
});
