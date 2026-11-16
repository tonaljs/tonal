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
      family: "major",
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

  test("family", () => {
    const family = (name: string) => ChordType.get(name).family;
    const families = (names: string) => names.split(" ").map(family);
    const all = (fam: string, names: string) =>
      expect(families(names)).toEqual(names.split(" ").map(() => fam));
    all("major", "M maj7 6 69 add9 maj9 maj13 maj#4 M7b5 Mb5 Madd4 M7b6");
    all("minor", "m m7 m6 mMaj7 m9 m11 m13 madd9 m#5 m7#5 mb6");
    all("dominant", "7 9 13 7b9 7#9 7#11 7b5 7#5 aug7 7alt alt7 7no5 7susadd3");
    all("half-diminished", "m7b5 m9b5");
    all("diminished", "dim dim7 oM7 o7M7");
    all("augmented", "aug maj7#5 maj9#5 +add9");
    all("suspended", "sus4 sus2 sus24 7sus4 9sus4 13sus4 7b9sus 11 11b9");
    all("power", "5");
    // spelled with a minor third (10m)
    expect(family("quartal")).toEqual("minor");
    expect(family("nonsense")).toEqual("");
  });

  test("every chord type has a family", () => {
    const missing = ChordType.all().filter((type) => !type.family);
    expect(missing).toEqual([]);
  });

  test("family from intervals", () => {
    expect(ChordType.family(["1P", "3M", "5P", "7m"])).toEqual("dominant");
    expect(ChordType.family(["1P", "5P", "7m"])).toEqual("dominant");
    expect(ChordType.family(["1P", "5P", "7M"])).toEqual("major");
    expect(ChordType.family(["1P", "5d"])).toEqual("diminished");
    expect(ChordType.family(["1P", "5A"])).toEqual("augmented");
    expect(ChordType.family(["1P", "5P", "8P"])).toEqual("power");
    expect(ChordType.family(["1P"])).toEqual("power");
    expect(ChordType.family([])).toEqual("");
  });

  test("add a chord", () => {
    ChordType.add(["1P", "5P"], ["q"]);
    expect(ChordType.get("q")).toMatchObject({
      chroma: "100000010000",
      family: "power",
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
