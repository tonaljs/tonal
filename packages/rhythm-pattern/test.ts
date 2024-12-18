import * as R from "./index";

const sequential = (start: number, step: number) => {
  let current = start;
  return () => (current += step);
};

describe("rhythm-pattern", () => {
  it("generates binary rhythms", () => {
    expect(R.binary(13)).toEqual([1, 1, 0, 1]);
    expect(R.binary(12, 13)).toEqual([1, 1, 0, 0, 1, 1, 0, 1]);
  });

  it("generates hexadecimal patterns", () => {
    expect(R.hex("8f")).toEqual([1, 0, 0, 0, 1, 1, 1, 1]);
  });

  it("generates rhythms from onset spaces", () => {
    expect(R.onsets(1, 2, 2, 1)).toEqual([1, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
  });

  it("generates random patterns", () => {
    expect(R.random(10)).toHaveLength(10);
    const rnd = sequential(0.25, 0.1);
    expect(R.random(5, 0.5, rnd)).toEqual([0, 0, 1, 1, 1]);
  });

  it("generates probabilistic patterns", () => {
    const rnd = () => 0.5;
    expect(R.probability([0.5, 0.2, 0, 1, 0], rnd)).toEqual([1, 0, 0, 1, 0]);
  });

  it("rotates pattern", () => {
    expect(R.rotate([1, 0, 0, 1], 0)).toEqual([1, 0, 0, 1]);
    expect(R.rotate([1, 0, 0, 1], 1)).toEqual([1, 1, 0, 0]);
    expect(R.rotate([1, 0, 0, 1], 2)).toEqual([0, 1, 1, 0]);
    expect(R.rotate([1, 0, 0, 1], 3)).toEqual([0, 0, 1, 1]);
    expect(R.rotate([1, 0, 0, 1], 4)).toEqual([1, 0, 0, 1]);
    expect(R.rotate([1, 0, 0, 1], -1)).toEqual([0, 0, 1, 1]);
    expect(R.rotate([1, 0, 0, 1], -2)).toEqual([0, 1, 1, 0]);
  });

  it("generates euclidian patterns", () => {
    expect(R.euclid(8, 3)).toEqual([1, 0, 0, 1, 0, 0, 1, 0]);
  });
});
