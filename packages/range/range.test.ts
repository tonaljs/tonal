import Range from "./index";
const { numeric, chromatic } = Range;

const $ = (str: string) => str.split(" ");

describe("tonal-range", () => {
  describe("numeric", () => {
    test("special cases", () => {
      expect(numeric([])).toEqual([]);
      expect(numeric(["C4"])).toEqual([60]);
    });
    test("note in midi numbers", () => {
      expect(numeric([0, 10])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(numeric([10, 0])).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
      expect(numeric([5, 0])).toEqual([5, 4, 3, 2, 1, 0]);
      expect(numeric([10, 5])).toEqual([10, 9, 8, 7, 6, 5]);
    });

    test("negative numbers are not allowed", () => {
      expect(numeric([5, -5])).toEqual([]);
      expect(numeric([5, -5, 0])).toEqual([]);
      expect(numeric([-5, -10])).toEqual([]);
    });

    test("notes with names", () => {
      const r1 = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

      expect(numeric(["C4", "C5"])).toEqual(r1);
      const r2 = [72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60];

      expect(numeric(["C5", "C4"])).toEqual(r2);
    });

    test("multiple notes in a string", () => {
      expect(numeric($("C2 F2 Bb1 C2"))).toEqual([
        36,
        37,
        38,
        39,
        40,
        41,
        40,
        39,
        38,
        37,
        36,
        35,
        34,
        35,
        36
      ]);
    });
  });

  describe("chromatic", () => {
    test("note names", () => {
      expect(chromatic(["A3", "A4"])).toEqual(
        $("A3 Bb3 B3 C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4")
      );
      expect(chromatic(["A4", "A3"])).toEqual(
        $("A4 Ab4 G4 Gb4 F4 E4 Eb4 D4 Db4 C4 B3 Bb3 A3")
      );
      expect(chromatic($("C3 Eb3 A2"))).toEqual(
        $("C3 Db3 D3 Eb3 D3 Db3 C3 B2 Bb2 A2")
      );
    });

    test("chromatic - use sharps", () => {
      expect(chromatic(["C2", "C3"], { sharps: true })).toEqual(
        $("C2 C#2 D2 D#2 E2 F2 F#2 G2 G#2 A2 A#2 B2 C3")
      );
      expect(
        chromatic(["C2", "C3"], { sharps: true, pitchClass: true })
      ).toEqual($("C C# D D# E F F# G G# A A# B C"));
    });
  });
});
