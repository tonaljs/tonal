import { distance } from "../index";

const allIntervalsFrom = (from: string) => (str: string) =>
  str
    .split(" ")
    .map(n => distance(from, n))
    .join(" ");

describe("distance", () => {
  describe("find intervals between notes", () => {
    test("interval between notes", () => {
      const fromC3 = allIntervalsFrom("C3");
      expect(fromC3("C3 e3 e4 c2 e2")).toEqual("1P 3M 10M -8P -6m");
    });

    test("intervals between pitch classes are always ascending", () => {
      expect(distance("C", "D")).toEqual("2M");

      const fromC = allIntervalsFrom("C");
      expect(fromC("c d e f g a b")).toEqual("1P 2M 3M 4P 5P 6M 7M");

      const fromG = allIntervalsFrom("G");
      expect(fromG("c d e f g a b")).toEqual("4P 5P 6M 7m 1P 2M 3M");
    });

    test("if a note is a pitch class, the distance is between pitch classes", () => {
      expect(distance("C", "C2")).toBe("1P");
      expect(distance("C2", "C")).toBe("1P");
    });

    test("notes must be valid", () => {
      expect(distance("one", "two")).toBe("");
    });
  });
});
