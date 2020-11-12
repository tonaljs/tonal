import ChordType from "./index";
import { interval } from "@tonaljs/core";
import DATA from "./data";

const INTERVALS = DATA.map((d) => d[0]).sort();

describe("@tonaljs/chord-type", () => {
  test("names", () => {
    // sorted
    expect(ChordType.names().slice(0, 5)).toEqual([
      "fifth",
      "suspended fourth",
      "suspended fourth seventh",
      "augmented",
      "major seventh flat sixth",
    ]);
  });

  test("symbols", () => {
    // sorted
    expect(ChordType.symbols().slice(0, 3)).toEqual([
      "5",
      "M7#5sus4",
      "7#5sus4",
    ]);
  });

  test("all returns all chords", () => {
    expect(ChordType.all()).toHaveLength(106);
  });

  test("get ", () => {
    expect(ChordType.get("major")).toEqual({
      empty: false,
      setNum: 2192,
      name: "major",
      quality: "Major",
      intervals: ["1P", "3M", "5P"],
      aliases: ["M", "^", ""],
      chroma: "100010010000",
      normalized: "100001000100",
    });
  });

  test("add a chord", () => {
    ChordType.add(["1P", "5P"], ["q"]);
    expect(ChordType.get("q")).toMatchObject({
      chroma: "100000010000",
    });
    ChordType.add(["1P", "5P"], ["q"], "quinta");
    expect(ChordType.get("quinta")).toEqual(ChordType.get("q"));
  });

  test("clear dictionary", () => {
    ChordType.removeAll();
    expect(ChordType.all()).toEqual([]);
    expect(ChordType.keys()).toEqual([]);
  });
});

describe("@tonal/chord-type data", () => {
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
