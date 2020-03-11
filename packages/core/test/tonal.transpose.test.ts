import { transpose } from "../index";

const transposeAllFrom = (from: string) => (str: string) =>
  str.split(" ").map(i => transpose(from, i));
const transposeAllBy = (by: string) => (str: string) =>
  str.split(" ").map(n => transpose(n, by));

describe("Transpose", () => {
  describe("transpose notes", () => {
    test("transpose pitch classes by intervals", () => {
      const fromBb = transposeAllFrom("Bb");
      expect(fromBb("P1 M3 P5 M7")).toEqual(["Bb", "D", "F", "A"]);
    });

    test("transpose notes by intervals", () => {
      const fromBb2 = transposeAllFrom("Bb2");
      expect(fromBb2("P1 M3 P5 M7")).toEqual(["Bb2", "D3", "F3", "A3"]);
    });

    test("tranpose note by descending intervas", () => {
      const fromBb = transposeAllFrom("Bb");
      expect(fromBb("P-1 M-3 P-5 M-7")).toEqual(["Bb", "Gb", "Eb", "Cb"]);
    });

    test("transpose by interval", () => {
      const by3M = transposeAllBy("3M");
      expect(by3M("c2 d3 f4 g5")).toEqual(["E2", "F#3", "A4", "B5"]);
    });

    test("invalid notes and intervals", () => {
      expect(transpose("M3", "blah")).toBe("");
      expect(transpose("blah", "C2")).toBe("");
      expect(transpose("", "")).toBe("");
    });

    test("transpose by descending intervals", () => {
      const byDesc2M = transposeAllBy("-2M");
      expect(byDesc2M("c2 d3 f4 g5")).toEqual(["Bb1", "C3", "Eb4", "F5"]);
    });

    test("transpose edge cases", () => {
      const fromC2 = transposeAllFrom("C2");

      expect(fromC2("1d 1P 1A")).toEqual(["Cb2", "C2", "C#2"]);
      expect(fromC2("-1d -1P -1A")).toEqual(["C#2", "C2", "Cb2"]);
      expect(fromC2("2d 2m 2M 2A")).toEqual(["Dbb2", "Db2", "D2", "D#2"]);
      expect(fromC2("-2d -2m -2M -2A")).toEqual(["B#1", "B1", "Bb1", "Bbb1"]);
      expect(fromC2("4dd 4d 4P 4A 4AA")).toEqual([
        "Fbb2",
        "Fb2",
        "F2",
        "F#2",
        "F##2"
      ]);
      expect(fromC2("5P -5P 5A -5A")).toEqual(["G2", "F1", "G#2", "Fb1"]);
      expect(fromC2("6M -6M 6m -6m")).toEqual(["A2", "Eb1", "Ab2", "E1"]);
    });
  });
});
