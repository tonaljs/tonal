/* global describe test expect */
import * as note from "../index";

const $ = (str: string) => str.split(" ");
const map = (fn: (str: any) => any, str: any) => str.split(" ").map(fn);

describe("tonal-note", () => {
  test("tokenize", () => {
    expect(note.tokenize("Cbb5 major")).toEqual(["C", "bb", "5", "major"]);
    expect(note.tokenize("Ax")).toEqual(["A", "##", "", ""]);
    expect(note.tokenize("CM")).toEqual(["C", "", "", "M"]);
    expect(note.tokenize("maj7")).toEqual(["", "", "", "maj7"]);
    expect(note.tokenize("")).toEqual(["", "", "", ""]);
    expect(note.tokenize("bb")).toEqual(["B", "b", "", ""]);
    expect(note.tokenize("##")).toEqual(["", "##", "", ""]);
    expect(note.tokenize(3)).toEqual(["", "", "", ""]);
    //@ts-ignore
    expect(note.tokenize(false)).toEqual(["", "", "", ""]);
    expect(note.tokenize()).toEqual(["", "", "", ""]);
    //@ts-ignore
    expect(note.tokenize(null)).toEqual(["", "", "", ""]);
  });

  test("name", () => {
    const names = map(note.name, "c fx dbb bbb c##-1 fbb6");
    expect(names).toEqual(["C", "F##", "Dbb", "Bbb", "C##-1", "Fbb6"]);
    expect(note.name("blah")).toEqual(null);
    //@ts-ignore
    expect(note.name()).toEqual(null);
  });

  test("build", () => {
    expect(note.build({ step: 1, alt: -1 })).toBe("Db");
    expect(note.build({ step: 2, alt: 1, oct: null })).toBe("E#");
    expect(note.build({ step: 5 })).toBe("A");
    expect(note.build({ step: -1 })).toBe(null);
    expect(note.build({ step: 8 })).toBe(null);
    expect(note.build({})).toBe(null);
    expect(note.build()).toBe(null);
    //@ts-ignore
    expect(note.build("blah")).toBe(null);
  });

  test("from", () => {
    expect(note.from({ step: 1, alt: -1 })).toBe("Db");
    expect(note.from({ step: 2, alt: 1, oct: null })).toBe("E#");
    expect(note.from({ step: 5 })).toBe("A");
    expect(note.from({ step: -1 })).toBe(null);
    expect(note.from({ step: 8 })).toBe(null);
    expect(note.from({})).toBe(null);
    expect(note.from()).toBe(null);
    //@ts-ignore
    expect(note.from("blah")).toBe(null);
    expect(note.from({ alt: 1 }, "A4")).toBe("A#4");
    expect(note.from({ alt: 0 }, "C#3")).toBe("C3");
    expect(note.from({ step: 2, oct: 3 }, "B#")).toBe("E#3");
  });

  test("names", () => {
    expect(note.names()).toEqual(
      $("C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B")
    );
    expect(note.names(" ")).toEqual($("C D E F G A B"));
    expect(note.names("b ")).toEqual($("C Db D Eb E F Gb G Ab A Bb B"));
    expect(note.names("# ")).toEqual($("C C# D D# E F F# G G# A A# B"));
    expect(note.names(" b#")).toEqual(note.names());
  });

  test("props", () => {
    expect(note.props("C#3")).toEqual({
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
    expect(note.props("Bb-20")).toEqual({
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
    // @ts-ignore
    expect(note.props("major")).toEqual(note.props());
  });

  test("oct", () => {
    const octs = map(note.oct, "a-2 b-1 c0 d1 e2 f3 g4 a5 b6 c7 d8 c9 d10");
    expect(octs).toEqual([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    expect(note.oct("c")).toBe(null);
    expect(note.oct("blah")).toBe(null);
  });

  test("midi", () => {
    const midis = "c4 d4 e4 f4 g4 a4 b4 c4 c-1 c-2".split(" ").map(note.midi);
    expect(midis).toEqual([60, 62, 64, 65, 67, 69, 71, 60, 0, null]);
    expect(note.midi("C")).toBe(null);
    expect(note.midi("bla")).toBe(null);
    //@ts-ignore
    expect(note.midi(true)).toBe(null);
    //@ts-ignore
    expect(note.midi(false)).toBe(null);
  });

  test("fromMidi", () => {
    let notes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
    expect(notes.map(note.fromMidi).join(" ")).toEqual(
      "C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4 Bb4 B4 C5"
    );
    expect(notes.map(n => note.fromMidi(n, true)).join(" ")).toEqual(
      "C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5"
    );
    expect(note.fromMidi(60)).toEqual("C4");
  });

  test("midi accepts valid MIDI note numbers", () => {
    expect(note.midi(60)).toBe(60);
    expect(note.midi("60")).toBe(60);
    expect(note.midi(0)).toBe(0);
    expect(note.midi("0")).toBe(0);
    expect(note.midi(-1)).toBe(null);
    expect(note.midi(128)).toBe(null);
  });

  test("freq", () => {
    expect(note.freq("A4")).toBe(440);
    expect(note.freq(69)).toBe(440);
    expect(note.freq("bla")).toBe(null);
  });

  test("freqToMidi", () => {
    expect(note.freqToMidi(220)).toBe(57);
    expect(note.freqToMidi(261.62)).toBe(60);
    expect(note.freqToMidi(261)).toBe(59.96);
  });
  test("midiToFreq", () => {
    expect(note.midiToFreq(57)).toBe(220);
    expect(Math.floor(note.midiToFreq(60) as number)).toEqual(261);
    expect(note.midiToFreq(57, 440)).toBe(220);
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

  test("pc", () => {
    const pcs = map(note.pc, "a b0 d2 e# fb3 g###4 bbbb5");
    expect(pcs).toEqual(["A", "B", "D", "E#", "Fb", "G###", "Bbbb"]);
    expect(note.pc("blah")).toBe(null);
    expect(note.pc("h")).toBe(null);
  });

  test("altToAcc", () => {
    const accs = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(note.altToAcc);
    const expected = ["bbbb", "bbb", "bb", "b", "", "#", "##", "###", "####"];
    expect(accs).toEqual(expected);
  });

  test("stepToLetter", () => {
    const steps = [0, 1, 2, 3, 4, 5, 6];
    expect(steps.map(note.stepToLetter)).toEqual($("C D E F G A B"));
    expect(note.stepToLetter(-1)).toBe(undefined);
    expect(note.stepToLetter(7)).toBe(undefined);
  });

  test("simplify", () => {
    const notes = $("C## C### F##4 Gbbb5 B#4 Cbb4");
    expect(notes.map(note.simplify)).toEqual($("D D# G4 E5 C5 Bb3"));
    expect(notes.map(n => note.simplify(n, false))).toEqual(
      $("D Eb G4 E5 C5 A#3")
    );

    expect(note.simplify("C#")).toEqual("C#");
    expect(note.simplify("C#", false)).toEqual("Db");
    expect(note.simplify("ohhaimark")).toEqual(null);
  });
});
