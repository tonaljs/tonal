import Sonority from ".";

const $ = str => str.split(" ");

describe("Sonority module", () => {
  test("density", () => {
    expect(Sonority.density($("c e g b"))).toEqual([2, 2, 1, 0, 1, 0]);
    expect(Sonority.density($("c d gb"))).toEqual([0, 1, 0, 1, 0, 1]);
  });
});
