import DATA from "./data";

const INTERVALS = DATA.map(d => d[0]).sort();

describe("chord-type data", () => {
  test("no repeated intervals", () => {
    for (let i = 1; i < INTERVALS.length; i++) {
      expect(INTERVALS[i - 1]).not.toEqual(INTERVALS[i]);
    }
  });
});
