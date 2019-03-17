import Dft from ".";

const $ = str => str.split(" ");

describe("tonal-pcset-Dft", () => {
  test("dft", () => {
    expect(Dft.dft($("C4 E4 G#4"))).toEqual([
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
    expect(Dft.spectra($("C4 E4 G#4"))).toEqual([3, 0, 0, 3, 0, 0, 3]);
  });

  test("distance", () => {
    expect(Dft.distance($("C E G"), $("C Eb G"))).toBe(1.5307337294603596);
  });
});
