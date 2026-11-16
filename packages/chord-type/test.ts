import { describe, expect, test } from "vitest";
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
    expect(ChordType.all()).toHaveLength(115);
  });

  test("get ", () => {
    expect(ChordType.get("major")).toEqual({
      empty: false,
      setNum: 2192,
      name: "major",
      quality: "Major",
      intervals: ["1P", "3M", "5P"],
      aliases: ["M", "^", "", "maj"],
      chroma: "100010010000",
      normalized: "100001000100",
    });
  });

  test("chart qualities", () => {
    const intervals = (name: string) => ChordType.get(name).intervals.join(" ");
    expect(intervals("-b6")).toEqual("1P 3m 5P 6m");
    expect(intervals("-7b6")).toEqual("1P 3m 5P 6m 7m");
    expect(intervals("-9b6")).toEqual("1P 3m 5P 6m 7m 9M");
    expect(intervals("-^11")).toEqual("1P 3m 5P 7M 9M 11P");
    expect(intervals("-^13")).toEqual("1P 3m 5P 7M 9M 13M");
    expect(intervals("-add2")).toEqual("1P 3m 5P 9M");
    expect(intervals("-add4")).toEqual("1P 3m 4P 5P");
    expect(intervals("add4")).toEqual("1P 3M 4P 5P");
    expect(intervals("7susadd3")).toEqual("1P 3M 4P 5P 7m");
    expect(intervals("7susb9")).toEqual("1P 4P 5P 7m 9m");
    expect(intervals("7susb9b13")).toEqual("1P 4P 5P 7m 9m 13m");
    expect(intervals("^7#9")).toEqual("1P 3M 5P 7M 9A");
    expect(intervals("^7b5")).toEqual("1P 3M 5d 7M");
    expect(intervals("^13#11")).toEqual("1P 3M 5P 7M 9M 11A 13M");
    expect(intervals("h9")).toEqual("1P 3m 5d 7m 9M");
    expect(intervals("o^7")).toEqual("1P 3m 5d 7M");
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
          data,
        );
        throw e;
      }
    });
  });
});

describe("chord type input safety", () => {
  test("Object.prototype keys are not chord types", () => {
    for (const key of [
      "constructor",
      "toString",
      "__proto__",
      "hasOwnProperty",
    ]) {
      expect(ChordType.get(key).empty).toBe(true);
    }
  });
});
