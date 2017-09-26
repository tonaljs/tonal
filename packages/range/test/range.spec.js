const range = require("../index");

const $ = str => str.split(" ");

describe("tonal-range", () => {
  test("numeric - multiple notes in a string", () => {
    const result = [36, 37, 38, 39, 40, 41, 40, 39, 38, 37, 36, 35, 34, 35, 36];
    expect(range.numeric($("C2 F2 Bb1 C2"))).toEqual(result);
  });

  test("fifths", () => {
    expect(range.fifths("C", [0, 6])).toEqual($("C G D A E B F#"));
    expect(range.fifths("C", [0, -6])).toEqual($("C F Bb Eb Ab Db Gb"));
  });

  test("numeric - numbers array", () => {
    expect(range.numeric([0, 10])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(range.numeric([10, 0])).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    expect(range.numeric([0, -5])).toEqual([0, -1, -2, -3, -4, -5]);
    expect(range.numeric([-5, -10])).toEqual([-5, -6, -7, -8, -9, -10]);
  });
  test("numeric - notes array", () => {
    const r1 = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

    expect(range.numeric(["C4", "C5"])).toEqual(r1);
    const r2 = [72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60];

    expect(range.numeric(["C5", "C4"])).toEqual(r2);
  });

  test("chromatic", () => {
    expect(range.chromatic(["A3", "A4"])).toEqual(
      $("A3 Bb3 B3 C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4")
    );
    expect(range.chromatic(["A4", "A3"])).toEqual(
      $("A4 Ab4 G4 Gb4 F4 E4 Eb4 D4 Db4 C4 B3 Bb3 A3")
    );
    expect(range.chromatic($("C3 Eb3 A2"))).toEqual(
      $("C3 Db3 D3 Eb3 D3 Db3 C3 B2 Bb2 A2")
    );
  });

  test("chromatic - sharps", () => {
    expect(range.chromatic(["C2", "C3"], true)).toEqual(
      $("C2 C#2 D2 D#2 E2 F2 F#2 G2 G#2 A2 A#2 B2 C3")
    );
  });

  test("pitchSet", () => {
    expect(range.pitchSet(["C", "D", "E"], ["C2", "C4"])).toEqual(
      $("C2 D2 E2 C3 D3 E3 C4")
    );
    expect(range.pitchSet($("C D E F G A B"), ["C3", "C2"])).toEqual(
      $("C3 B2 A2 G2 F2 E2 D2 C2")
    );
  });
});
