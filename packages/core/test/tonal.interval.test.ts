import { interval, tokenizeInterval as tokenize } from "../index";

describe("interval", () => {
  test("tokenize", () => {
    expect(tokenize("-2M")).toEqual(["-2", "M"]);
    expect(tokenize("M-3")).toEqual(["-3", "M"]);
  });

  describe("interval from string", () => {
    test("has all properties", () => {
      expect(interval("4d")).toEqual({
        empty: false,
        name: "4d",
        num: 4,
        q: "d",
        type: "perfectable",
        alt: -1,
        chroma: 4,
        dir: 1,
        coord: [-8, 5],
        oct: 0,
        semitones: 4,
        simple: 4,
        step: 3
      });
    });

    test("accepts interval as parameter", () => {
      expect(interval(interval("5P"))).toEqual(interval("5P"));
    });
    test("name", () => {
      const names = (src: string) =>
        src
          .split(" ")
          .map(s => interval(s).name)
          .join(" ");
      expect(names("1P 2M 3M 4P 5P 6M 7M")).toEqual("1P 2M 3M 4P 5P 6M 7M");
      expect(names("P1 M2 M3 P4 P5 M6 M7")).toEqual("1P 2M 3M 4P 5P 6M 7M");
      expect(names("-1P -2M -3M -4P -5P -6M -7M")).toEqual(
        "-1P -2M -3M -4P -5P -6M -7M"
      );
      expect(names("P-1 M-2 M-3 P-4 P-5 M-6 M-7")).toEqual(
        "-1P -2M -3M -4P -5P -6M -7M"
      );
      expect(interval("not-an-interval").empty).toEqual(true);
      expect(interval("2P").empty).toBe(true);
    });
    test("q", () => {
      const q = (str: string) => str.split(" ").map(i => interval(i).q);
      expect(q("1dd 1d 1P 1A 1AA")).toEqual(["dd", "d", "P", "A", "AA"]);
      expect(q("2dd 2d 2m 2M 2A 2AA")).toEqual([
        "dd",
        "d",
        "m",
        "M",
        "A",
        "AA"
      ]);
    });

    test("alt", () => {
      const alt = (str: string) => str.split(" ").map(i => interval(i).alt);
      expect(alt("1dd 2dd 3dd 4dd")).toEqual([-2, -3, -3, -2]);
    });

    test("simple", () => {
      const simple = (str: string) =>
        str.split(" ").map(i => interval(i).simple);
      expect(simple("1P 2M 3M 4P")).toEqual([1, 2, 3, 4]);
      expect(simple("8P 9M 10M 11P")).toEqual([8, 2, 3, 4]);
      expect(simple("-8P -9M -10M -11P")).toEqual([-8, -2, -3, -4]);
    });
  });

  describe("interval from pitch props", () => {
    it("requires step, alt and dir", () => {
      expect(interval({ step: 0, alt: 0, dir: 1 }).name).toBe("1P");
      expect(interval({ step: 0, alt: -2, dir: 1 }).name).toBe("1dd");
      expect(interval({ step: 1, alt: 1, dir: 1 }).name).toBe("2A");
      expect(interval({ step: 2, alt: -2, dir: 1 }).name).toBe("3d");
      expect(interval({ step: 1, alt: 1, dir: -1 }).name).toBe("-2A");
      expect(interval({ step: 1000, alt: 0 }).empty).toBe(true);
    });

    it("accepts octave", () => {
      expect(interval({ step: 0, alt: 0, oct: 0, dir: 1 }).name).toBe("1P");
      expect(interval({ step: 0, alt: -1, oct: 1, dir: -1 }).name).toBe("-8d");
      expect(interval({ step: 0, alt: 1, oct: 2, dir: -1 }).name).toBe("-15A");
      expect(interval({ step: 1, alt: -1, oct: 1, dir: -1 }).name).toBe("-9m");
      expect(interval({ step: 0, alt: 0, oct: 0, dir: 1 }).name).toBe("1P");
    });
  });
});
