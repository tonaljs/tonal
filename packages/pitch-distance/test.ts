import { describe, expect, test } from "vitest";
import { distance, transpose } from "./index";

const allIntervalsFrom = (from: string) => (str: string) =>
  str
    .split(" ")
    .map((n) => distance(from, n))
    .join(" ");

describe("distance", () => {
  test("interval between notes", () => {
    const fromC3 = allIntervalsFrom("C3");
    expect(fromC3("C3 e3 e4 c2 e2")).toEqual("1P 3M 10M -8P -6m");
  });

  test("unison interval edge case #243", () => {
    expect(distance("Db4", "C#5")).toEqual("7A");
    expect(distance("Db4", "C#4")).toEqual("-2d");
    expect(distance("Db", "C#")).toEqual("7A");
    expect(distance("C#", "Db")).toEqual("2d");
  });

  test("adjacent octaves #428", () => {
    expect(distance("B#4", "C4")).toBe("-7A");
    expect(distance("B#4", "C6")).toBe("9d");
    expect(distance("B#4", "C5")).toBe("2d");
    expect(distance("B##4", "C#5")).toBe("2d");
    expect(distance("B#5", "C6")).toBe("2d");
  });

  test("descending across the octave line #514", () => {
    expect(distance("C4", "B#3")).toBe("-2d");
    expect(distance("Cb4", "B3")).toBe("-2d");
    expect(distance("Cbb4", "A#3")).toBe("-3ddd");
    expect(distance("B#3", "C4")).toBe("2d");
    expect(distance("C4", "B#4")).toBe("7A");
    expect(transpose("C4", distance("C4", "B#3"))).toBe("B#3");
  });

  test("the letters decide the direction, even against the sound", () => {
    expect(distance("C4", "B##3")).toBe("-2dd");
    expect(distance("Cb4", "B#3")).toBe("-2dd");
    expect(distance("B#3", "Cb4")).toBe("2dd");
    expect(distance("C#4", "Dbb4")).toBe("2dd");
    expect(distance("C10", "B#9")).toBe("-2d");
    expect(distance("Cb-1", "B-2")).toBe("-2d");
  });

  test("a unison takes its direction from the sound", () => {
    expect(distance("C4", "C#4")).toBe("1A");
    expect(distance("C4", "Cb4")).toBe("-1A");
  });

  test("intervals between pitch classes are always ascending", () => {
    expect(distance("C", "D")).toEqual("2M");

    const fromC = allIntervalsFrom("C");
    expect(fromC("c d e f g a b")).toEqual("1P 2M 3M 4P 5P 6M 7M");

    const fromG = allIntervalsFrom("G");
    expect(fromG("c d e f g a b")).toEqual("4P 5P 6M 7m 1P 2M 3M");
  });

  test("intervals between pitch classes are simple, ascending by letter", () => {
    expect(distance("C#", "Dbb")).toEqual("2dd");
    expect(distance("Cbb", "A#")).toEqual("6AAA");
    expect(distance("C", "Cb")).toEqual("1d");
    expect(distance("C#", "C")).toEqual("1d");
  });

  test("if a note is a pitch class, the distance is between pitch classes", () => {
    expect(distance("C", "C2")).toBe("1P");
    expect(distance("C2", "C")).toBe("1P");
  });

  test("notes must be valid", () => {
    expect(distance("one", "two")).toBe("");
  });
});
