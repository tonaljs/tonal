/* global describe test expect */
import Note from "./";

const $ = str => str.split(" ");
const map = (fn, str) => str.split(" ").map(fn);

describe("tonal-note", () => {
  test("tokenize", () => {
    expect(Note.tokenize("Cbb5 major")).toEqual(["C", "bb", "5", "major"]);
    expect(Note.tokenize("Ax")).toEqual(["A", "##", "", ""]);
    expect(Note.tokenize("CM")).toEqual(["C", "", "", "M"]);
    expect(Note.tokenize("maj7")).toEqual(["", "", "", "maj7"]);
    expect(Note.tokenize("")).toEqual(["", "", "", ""]);
    expect(Note.tokenize("bb")).toEqual(["B", "b", "", ""]);
    expect(Note.tokenize("##")).toEqual(["", "##", "", ""]);
    expect(Note.tokenize(3)).toEqual(["", "", "", ""]);
    expect(Note.tokenize(false)).toEqual(["", "", "", ""]);
    expect(Note.tokenize()).toEqual(["", "", "", ""]);
    expect(Note.tokenize(null)).toEqual(["", "", "", ""]);
  });

  test("name", () => {
    const names = map(Note.name, "c fx dbb bbb c##-1 fbb6");
    expect(names).toEqual(["C", "F##", "Dbb", "Bbb", "C##-1", "Fbb6"]);
    expect(Note.name("blah")).toEqual(null);
    expect(Note.name()).toEqual(null);
  });

  test("from", () => {
    expect(Note.fromProps({ step: 1, alt: -1 })).toBe("Db");
    expect(Note.fromProps({ step: 2, alt: 1, oct: null })).toBe("E#");
    expect(Note.fromProps({ step: 5 })).toBe("A");
    expect(Note.fromProps({ step: -1 })).toBe(null);
    expect(Note.fromProps({ step: 8 })).toBe(null);
    expect(Note.fromProps({})).toBe(null);
    expect(Note.fromProps()).toBe(null);
    expect(Note.fromProps("blah")).toBe(null);
    expect(Note.fromProps({ alt: 1 }, "A4")).toBe("A#4");
    expect(Note.fromProps({ alt: 0 }, "C#3")).toBe("C3");
    expect(Note.fromProps({ step: 2, oct: 3 }, "B#")).toBe("E#3");
  });

  test("names", () => {
    expect(Note.names()).toEqual($("C D E F G A B"));
    expect(Note.names({ unaltered: true })).toEqual(Note.names());
    expect(Note.names({ flats: true })).toEqual(
      $("C Db D Eb E F Gb G Ab A Bb B")
    );
    expect(Note.names({ sharps: true })).toEqual(
      $("C C# D D# E F F# G G# A A# B")
    );
    expect(Note.names({ flats: true, sharps: true })).toEqual(
      $("C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B")
    );
  });

  test("props", () => {
    expect(Note.props("C#3")).toEqual({
      acc: "#",
      alt: 1,
      chroma: 1,
      letter: "C",
      name: "C#3",
      oct: 3,
      octStr: "3",
      pc: "C#",
      step: 0,
      midi: 49,
      freq: 138.59131548843604
    });
    expect(Note.props("Bb-20")).toEqual({
      acc: "b",
      alt: -1,
      chroma: 10,
      freq: 0.000027785525412445636,
      letter: "B",
      midi: -218,
      name: "Bb-20",
      oct: -20,
      octStr: "-20",
      pc: "Bb",
      step: 6
    });
    expect(Note.props("major")).toEqual(Note.props());
  });

  test("oct", () => {
    const octs = map(Note.oct, "a-2 b-1 c0 d1 e2 f3 g4 a5 b6 c7 d8 c9 d10");
    expect(octs).toEqual([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    expect(Note.oct("c")).toBe(null);
    expect(Note.oct("blah")).toBe(null);
  });

  test("midi", () => {
    const midis = "c4 d4 e4 f4 g4 a4 b4 c4 c-1 c-2".split(" ").map(Note.midi);
    expect(midis).toEqual([60, 62, 64, 65, 67, 69, 71, 60, 0, null]);
    expect(Note.midi("C")).toBe(null);
    expect(Note.midi("bla")).toBe(null);
    expect(Note.midi(true)).toBe(null);
    expect(Note.midi(false)).toBe(null);
  });

  test("fromMidi", () => {
    let notes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
    expect(notes.map(Note.fromMidi).join(" ")).toEqual(
      "C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4 Bb4 B4 C5"
    );
    expect(
      notes.map(n => Note.fromMidi(n, { sharps: true })).join(" ")
    ).toEqual("C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5");
    expect(
      notes.map(n => Note.fromMidi(n, { pitchClass: true })).join(" ")
    ).toEqual("C Db D Eb E F Gb G Ab A Bb B C");
  });

  test("midi accepts valid MIDI note numbers", () => {
    expect(Note.midi(60)).toBe(60);
    expect(Note.midi("60")).toBe(60);
    expect(Note.midi(0)).toBe(0);
    expect(Note.midi("0")).toBe(0);
    expect(Note.midi(-1)).toBe(null);
    expect(Note.midi(128)).toBe(null);
  });

  test("freq", () => {
    expect(Note.freq("A4")).toBe(440);
    expect(Note.freq(69)).toBe(440);
    expect(Note.freq("bla")).toBe(null);
  });

  test("freqToMidi", () => {
    expect(Note.freqToMidi(220)).toBe(57);
    expect(Note.freqToMidi(261.62)).toBe(60);
    expect(Note.freqToMidi(261)).toBe(59.96);
  });

  test("chroma", () => {
    const chromas = "Cb C Db D Eb E Fb F Gb G Ab A Bb B"
      .split(" ")
      .map(Note.chroma);
    expect(chromas).toEqual([11, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(
      "C C# D D# E E# F F# G G# A A# B B#".split(" ").map(Note.chroma)
    ).toEqual([0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 0]);
    expect(Note.chroma("blah")).toEqual(null);
  });

  test("pc", () => {
    const pcs = map(Note.pc, "a b0 d2 e# fb3 g###4 bbbb5");
    expect(pcs).toEqual(["A", "B", "D", "E#", "Fb", "G###", "Bbbb"]);
    expect(Note.pc("blah")).toBe(null);
    expect(Note.pc("h")).toBe(null);
  });

  test("altToAcc", () => {
    const accs = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(Note.altToAcc);
    const expected = ["bbbb", "bbb", "bb", "b", "", "#", "##", "###", "####"];
    expect(accs).toEqual(expected);
  });

  test("stepToLetter", () => {
    const steps = [0, 1, 2, 3, 4, 5, 6];
    expect(steps.map(Note.stepToLetter)).toEqual($("C D E F G A B"));
    expect(Note.stepToLetter(-1)).toBe(undefined);
    expect(Note.stepToLetter(7)).toBe(undefined);
  });

  test("simplify", () => {
    const notes = $("C## C### F##4 Gbbb5 B#4 Cbb4");
    expect(notes.map(Note.simplify)).toEqual($("D D# G4 E5 C5 Bb3"));
    expect(notes.map(n => Note.simplify(n, { sameAccType: false }))).toEqual(
      $("D Eb G4 E5 C5 A#3")
    );

    expect(Note.simplify("C#")).toEqual("C#");
    expect(Note.simplify("C#", { sameAccType: false })).toEqual("Db");
  });
});
