import { describe, expect, test } from "vitest";
import Interval from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/interval", () => {
  test("properties", () => {
    expect(Interval.get("P4")).toEqual({
      alt: 0,
      chroma: 5,
      coord: [-1, 1],
      dir: 1,
      empty: false,
      name: "4P",
      num: 4,
      oct: 0,
      q: "P",
      semitones: 5,
      simple: 4,
      step: 3,
      type: "perfectable",
    });
  });

  test("shorthand properties", () => {
    expect(Interval.name("d5")).toEqual("5d");
    expect(Interval.num("d5")).toEqual(5);
    expect(Interval.quality("d5")).toEqual("d");
    expect(Interval.semitones("d5")).toEqual(6);
  });

  test("distance", () => {
    expect(Interval.distance("C4", "G4")).toEqual("5P");
  });

  test("names", () => {
    expect(Interval.names()).toEqual([
      "1P",
      "2M",
      "3M",
      "4P",
      "5P",
      "6m",
      "7m",
    ]);
  });

  test("simplify intervals", () => {
    expect($("1P 2M 3M 4P 5P 6M 7M").map(Interval.simplify)).toEqual(
      $("1P 2M 3M 4P 5P 6M 7M"),
    );
    expect($("8P 9M 10M 11P 12P 13M 14M").map(Interval.simplify)).toEqual(
      $("8P 2M 3M 4P 5P 6M 7M"),
    );
    expect($("1d 1P 1A 8d 8P 8A 15d 15P 15A").map(Interval.simplify)).toEqual(
      $("1d 1P 1A 8d 8P 8A 8d 8P 8A"),
    );
    expect($("-1P -2M -3M -4P -5P -6M -7M").map(Interval.simplify)).toEqual(
      $("-1P -2M -3M -4P -5P -6M -7M"),
    );
    expect(
      $("-8P -9M -10M -11P -12P -13M -14M").map(Interval.simplify),
    ).toEqual($("-8P -2M -3M -4P -5P -6M -7M"));
    // an octave stays an octave, however many octaves it spans
    expect($("15P 22P 29P -15P -22P").map(Interval.simplify)).toEqual(
      $("8P 8P 8P -8P -8P"),
    );
    expect(Interval.simplify("x")).toEqual("");
  });

  test("invert intervals", () => {
    expect($("1P 2M 3M 4P 5P 6M 7M 8P").map(Interval.invert)).toEqual(
      $("8P 7m 6m 5P 4P 3m 2m 1P"),
    );
    expect($("1d 2m 3m 4d 5d 6m 7m 8d").map(Interval.invert)).toEqual(
      $("8A 7M 6M 5A 4A 3M 2M 1A"),
    );
    expect($("1A 2A 3A 4A 5A 6A 7A 8A").map(Interval.invert)).toEqual(
      $("8d 7d 6d 5d 4d 3d 2d 1d"),
    );
    expect($("-1P -2M -3M -4P -5P -6M -7M -8P").map(Interval.invert)).toEqual(
      $("-8P -7m -6m -5P -4P -3m -2m -1P"),
    );
    // compound intervals are simplified first
    expect($("9M 10M 11P 12P 13M 14M 15P").map(Interval.invert)).toEqual(
      $("7m 6m 5P 4P 3m 2m 1P"),
    );
    expect($("-9M -10m 16A").map(Interval.invert)).toEqual($("-7m -6M 7d"));
    expect(Interval.invert("x")).toEqual("");
  });

  test("pitchClass", () => {
    expect($("1P 3M 8P 10M 15P 17M").map(Interval.pitchClass)).toEqual(
      $("1P 3M 1P 3M 1P 3M"),
    );
    expect($("-2M -3M -5P -8P -10m").map(Interval.pitchClass)).toEqual(
      $("7m 6m 4P 1P 6M"),
    );
    // ascending by letter, like the distance between pitch classes
    expect($("1A 1d -1A 8d 2dd").map(Interval.pitchClass)).toEqual(
      $("1A 1d 1d 1d 2dd"),
    );
    expect(Interval.pitchClass("x")).toEqual("");
  });

  test("negate", () => {
    expect($("1P 3M -3M 9m -15P").map(Interval.negate)).toEqual(
      $("1P -3M 3M -9m 15P"),
    );
    // a unison is named in the direction of the sound
    expect($("1A -1A 1d").map(Interval.negate)).toEqual($("-1A 1A 1A"));
    expect(Interval.negate("x")).toEqual("");
  });

  test("abs", () => {
    expect($("1P 3M -3M -9m 2dd").map(Interval.abs)).toEqual(
      $("1P 3M 3M 9m 2dd"),
    );
    // "1d" is one semitone down, like "-1A"
    expect($("1A -1A 1d").map(Interval.abs)).toEqual($("1A 1A 1A"));
    expect(Interval.abs("x")).toEqual("");
  });

  test("multiply", () => {
    const fifths = [0, 1, 2, 3, 4].map((n) => Interval.multiply("5P", n));
    expect(fifths).toEqual($("1P 5P 9M 13M 17M"));
    expect(Interval.multiply("2M", 3)).toEqual("4A");
    expect(Interval.multiply("3M", 3)).toEqual("7A");
    expect(Interval.multiply("3m", 4)).toEqual("9d");
    expect(Interval.multiply("3M", -2)).toEqual("-5A");
    expect(Interval.multiply("-3M", -2)).toEqual("5A");
    expect(Interval.multiply("1A", 5)).toEqual("1AAAAA");
    expect(Interval.multiply("x", 2)).toEqual("");
    expect(Interval.multiply("3M", 1.5)).toEqual("");
  });

  test("any number of augmented or diminished", () => {
    expect(Interval.get("4AAAAA").semitones).toEqual(10);
    expect(Interval.get("AAAAA4").name).toEqual("4AAAAA");
    expect(Interval.get("ddd5").name).toEqual("5ddd");
    expect(Interval.get("-5ddddd").semitones).toEqual(-2);
    expect(Interval.add("4AAAA", "1A")).toEqual("4AAAAA");
  });

  test("fromSemitones", () => {
    let semis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M"),
    );
    semis = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("8P 9m 9M 10m 10M 11P 12d 12P 13m 13M 14m 14M"),
    );
    semis = [-0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("1P -2m -2M -3m -3M -4P -5d -5P -6m -6M -7m -7M"),
    );
    semis = [-12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23];
    expect(semis.map(Interval.fromSemitones)).toEqual(
      $("-8P -9m -9M -10m -10M -11P -12d -12P -13m -13M -14m -14M"),
    );
  });

  test("add", () => {
    expect(Interval.add("3m", "5P")).toEqual("7m");
    expect(Interval.names().map((n) => Interval.add("5P", n))).toEqual(
      $("5P 6M 7M 8P 9M 10m 11P"),
    );
    expect(Interval.names().map(Interval.addTo("5P"))).toEqual(
      $("5P 6M 7M 8P 9M 10m 11P"),
    );
  });

  test("subtract", () => {
    expect(Interval.subtract("5P", "3M")).toEqual("3m");
    expect(Interval.subtract("3M", "5P")).toEqual("-3m");
    expect(Interval.names().map((n) => Interval.subtract("5P", n))).toEqual(
      $("5P 4P 3m 2M 1P -2m -3m"),
    );
  });

  test("the letters decide the direction, even against the sound", () => {
    expect(Interval.subtract("2d", "1A")).toEqual("2dd");
    expect(Interval.subtract("2m", "1AA")).toEqual("2dd");
    expect(Interval.subtract("-2d", "-1A")).toEqual("-2dd");
    expect(Interval.add("2d", "-1A")).toEqual("2dd");
  });

  test("a unison takes its direction from the sound", () => {
    expect(Interval.subtract("1P", "1A")).toEqual("-1A");
    expect(Interval.subtract("2m", "2M")).toEqual("-1A");
  });

  describe("consonance", () => {
    // every interval up to two octaves, with qualities from dd to AA
    const perfectable = [1, 4, 5, 8, 11, 12, 15];
    const ascending = Array.from({ length: 15 }, (_, i) => i + 1).flatMap(
      (num) =>
        (perfectable.includes(num)
          ? ["dd", "d", "P", "A", "AA"]
          : ["dd", "d", "m", "M", "A", "AA"]
        ).map((q) => num + q),
    );
    const all = [...ascending, ...ascending.map((i) => "-" + i)];
    const perfect = $("1P 5P 8P 12P 15P");
    const imperfect = $("3m 3M 6m 6M 10m 10M 13m 13M");
    const fourths = $("4P 11P");
    const unsigned = (i: string) => i.replace("-", "");

    test("textbook categories", () => {
      for (const i of all) {
        const name = unsigned(i);
        const expected = perfect.includes(name)
          ? "perfect"
          : imperfect.includes(name)
            ? "imperfect"
            : "dissonant";
        expect([i, Interval.consonance(i)]).toEqual([i, expected]);
        expect(Interval.isConsonant(i)).toBe(expected !== "dissonant");
      }
    });

    test("the fourth as a consonance", () => {
      const options = { consonantFourth: true };
      expect(Interval.consonance("4P")).toBe("dissonant");
      expect(Interval.consonance("4P", options)).toBe("perfect");
      expect(Interval.consonance("-11P", options)).toBe("perfect");
      expect(Interval.isConsonant("4P", options)).toBe(true);
      expect(Interval.consonance("4A", options)).toBe("dissonant");
      expect(Interval.consonance("4d", options)).toBe("dissonant");
      for (const i of all) {
        const isFourth = fourths.includes(unsigned(i));
        expect(Interval.consonance(i, options)).toBe(
          isFourth ? "perfect" : Interval.consonance(i),
        );
      }
    });

    test("spelling decides, not sound", () => {
      expect(Interval.consonance("4d")).toBe("dissonant");
      expect(Interval.consonance("3M")).toBe("imperfect");
      expect(Interval.consonance("5A")).toBe("dissonant");
      expect(Interval.consonance("6m")).toBe("imperfect");
      expect(Interval.consonance("2A")).toBe("dissonant");
      expect(Interval.consonance("3m")).toBe("imperfect");
      expect(Interval.consonance("7d")).toBe("dissonant");
      expect(Interval.consonance("6M")).toBe("imperfect");
      expect(Interval.consonance("8d")).toBe("dissonant");
      expect(Interval.consonance("1A")).toBe("dissonant");
    });

    test("other notations", () => {
      expect(Interval.consonance("P5")).toBe("perfect");
      expect(Interval.consonance("M10")).toBe("imperfect");
      expect(Interval.consonance("22P")).toBe("perfect");
      expect(Interval.consonance("17M")).toBe("imperfect");
      expect(Interval.consonance(Interval.distance("C4", "F3"))).toBe(
        "perfect",
      );
    });

    test("invalid intervals", () => {
      for (const i of ["", "blah", "4M", "3P", "5m"]) {
        expect(Interval.consonance(i)).toBe("");
        expect(Interval.isConsonant(i)).toBe(false);
      }
    });

    test("laws", () => {
      for (const options of [{}, { consonantFourth: true }]) {
        const c = (i: string) => Interval.consonance(i, options);
        for (const i of all) {
          expect(c(i)).not.toBe("");
          expect(c(Interval.negate(i))).toBe(c(i));
          expect(c(Interval.add(i, i.startsWith("-") ? "-8P" : "8P"))).toBe(
            c(i),
          );
          // a fourth inverts to a fifth: they only agree if the fourth is a
          // consonance
          const pc = Interval.pitchClass(Interval.abs(i));
          const fourthOrFifth = pc === "4P" || pc === "5P";
          if (options.consonantFourth || !fourthOrFifth) {
            expect(c(Interval.invert(i))).toBe(c(i));
          } else {
            expect(c(Interval.invert(i))).not.toBe(c(i));
          }
        }
      }
    });
  });

  test("transposeFifths", () => {
    expect(Interval.transposeFifths("4P", 1)).toEqual("8P");
    expect(
      [0, 1, 2, 3, 4]
        .map((fifths) => Interval.transposeFifths("1P", fifths))
        .join(" "),
    ).toEqual("1P 5P 9M 13M 17M");
    expect(
      [0, -1, -2, -3, -4]
        .map((fifths) => Interval.transposeFifths("1P", fifths))
        .join(" "),
    ).toEqual("1P -5P -9M -13M -17M");
  });
});
