/* global describe test expect */
var note = require("../index");

const map = (fn, str) => str.split(" ").map(fn);

describe("tonal-note", () => {
  test("split", () => {
    expect(note.split("Cbb5 major")).toEqual({
      acc: "bb",
      letter: "C",
      type: "major",
      oct: "5"
    });
    expect(note.split("Ax").acc).toEqual("##");
  });

  test("isNote", () => {
    expect(note.isNote("c")).toBe(true);
    expect(note.isNote("blah")).toBe(false);
  });

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
    const midis = "c4 d4 e4 f4 g4 a4 b4 c4".split(" ").map(note.midi);
    expect(midis).toEqual([60, 62, 64, 65, 67, 69, 71, 60]);
    expect(note.midi("C")).toBe(null);
  });

  test("fromMidi", () => {
    let notes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
    expect(notes.map(note.fromMidi).join(" ")).toEqual(
      "C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4 Bb4 B4 C5"
    );
    expect(notes.map(n => note.fromMidi(n, true)).join(" ")).toEqual(
      "C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5"
    );
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

  test("freqToMidi", () => {
    expect(note.freqToMidi(220)).toBe(57);
    expect(note.freqToMidi(261.62)).toBe(60);
    expect(note.freqToMidi(261)).toBe(59.96);
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
