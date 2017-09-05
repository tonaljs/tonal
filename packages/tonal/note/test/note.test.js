/* global describe test expect */
var note = require("../index");

const map = (fn, str) => str.split(" ").map(fn);

describe("tonal-note", () => {
  test("step", () => {
    const steps = map(note.step, "c d e f g a b");
    expect(steps).toEqual([0, 1, 2, 3, 4, 5, 6]);

    expect(map(note.step, "c# d## e### f####")).toEqual([0, 1, 2, 3]);
  });

  test("oct", () => {
    const octs = map(note.oct, "a-2 b-1 c0 d1 e2 f3 g4 a5 b6 c7 d8 c9 d10");
    expect(octs).toEqual([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    expect(note.oct("c")).toBe(null);
    expect(note.oct("blah")).toBe(null);
  });

  test("midi", () => {
    const midi = "c4 d4 e4 f4 g4 a4 b4 c4".split(" ").map(note.midi);
    expect(midi).toEqual([60, 62, 64, 65, 67, 69, 71, 60]);
  });

  test("midi accepts numbers", () => {
    expect(note.midi(60)).toBe(60);
    expect(note.midi("60")).toBe(60);
    expect(note.midi("bla")).toBe(null);
  });

  test("toFreq", () => {
    expect(note.freq("A4")).toBe(440);
    expect(note.freq(69)).toBe(440);
    expect(note.freq("bla")).toBe(null);
  });

  test("chroma", () => {
    const chromas = "Cb C Db D Eb E Fb F Gb G Ab A Bb B"
      .split(" ")
      .map(note.chroma);
    expect(chromas).toEqual([11, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(
      "C C# D D# E E# F F# G G# A A# B B#".split(" ").map(note.chroma)
    ).toEqual([0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 0]);
  });

  test("name", () => {
    const names = map(note.name, "c fx dbb bbb c##-1 fbb6");
    expect(names).toEqual(["C", "F##", "Dbb", "Bbb", "C##-1", "Fbb6"]);
  });

  test("pc", () => {
    const pcs = map(note.pc, "a b0 d2 e# fb3 g###4 bbbb5 h j");
    expect(pcs).toEqual([
      "A",
      "B",
      "D",
      "E#",
      "Fb",
      "G###",
      "Bbbb",
      null,
      null
    ]);
  });
});
