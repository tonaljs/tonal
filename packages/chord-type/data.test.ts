import { interval } from "@tonaljs/core";
import DATA from "./data";

const INTERVALS = DATA.map((d) => d[0]).sort();

describe("chord-type data", () => {
  test("no repeated intervals", () => {
    for (let i = 1; i < INTERVALS.length; i++) {
      expect(INTERVALS[i - 1]).not.toEqual(INTERVALS[i]);
    }
  });

  test("all chords must have abreviatures", () => {
    DATA.forEach((data) => {
      const abrrvs = data[2].trim();
      expect(abrrvs.length).toBeGreaterThan(0);
    });
  });

  test("intervals should be in ascending order", () => {
    DATA.forEach((data) => {
      const [list] = data;
      const intervals = list.split(" ").map((i) => interval(i).semitones || 0);

      try {
        for (let i = 1; i < intervals.length; i++) {
          expect(intervals[i - 1]).toBeLessThan(intervals[i]);
        }
      } catch (e) {
        // tslint:disable-next-line
        console.error(
          `Invalid chord: intervals should be in ascending order`,
          data
        );
        throw e;
      }
    });
  });
});
