import Midi from "./index";

describe("midi", () => {
  test("isMidi", () => {
    expect(Midi.isMidi(100)).toBe(true);
  });

  test("toMidi", () => {
    expect(Midi.toMidi(100)).toBe(100);
    expect(Midi.toMidi("C4")).toBe(60);
    expect(Midi.toMidi("60")).toBe(60);
    expect(Midi.toMidi(0)).toBe(0);
    expect(Midi.toMidi("0")).toBe(0);
    expect(Midi.toMidi(-1)).toBe(null);
    expect(Midi.toMidi(128)).toBe(null);
    expect(Midi.toMidi("blah")).toBe(null);
    expect(Midi.toMidi(NaN)).toBe(null);
  });

  test("freqToMidi", () => {
    expect(Midi.freqToMidi(220)).toBe(57);
    expect(Midi.freqToMidi(261.62)).toBe(60);
    expect(Midi.freqToMidi(261)).toBe(59.96);
  });

  test("midiToFreq", () => {
    expect(Midi.midiToFreq(60)).toEqual(261.6255653005986);
    expect(Midi.midiToFreq(69, 443)).toEqual(443);
  });

  test("midiToNoteName", () => {
    const notes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
    expect(notes.map((m) => Midi.midiToNoteName(m)).join(" ")).toEqual(
      "C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4 Bb4 B4 C5"
    );
    expect(
      notes.map((n) => Midi.midiToNoteName(n, { sharps: true })).join(" ")
    ).toEqual("C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5");
    expect(
      notes.map((n) => Midi.midiToNoteName(n, { pitchClass: true })).join(" ")
    ).toEqual("C Db D Eb E F Gb G Ab A Bb B C");

    expect(Midi.midiToNoteName(NaN)).toEqual("");
    expect(Midi.midiToNoteName(-Infinity)).toEqual("");
    expect(Midi.midiToNoteName(Infinity)).toEqual("");
  });

  describe("Midi.pcset", () => {
    test("from chroma", () => {
      expect(Midi.pcset("100100100101")).toEqual([0, 3, 6, 9, 11]);
    });
    test("from midi", () => {
      expect(Midi.pcset([62, 63, 60, 65, 70, 72])).toEqual([0, 2, 3, 5, 10]);
    });
  });

  describe("Midi.pcsetNearest", () => {
    test("find nearest upwards", () => {
      const nearest = Midi.pcsetNearest([0, 5, 7]);
      expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(nearest)).toEqual([
        0, 0, 0, 5, 5, 5, 7, 7, 7, 7, 7, 7, 12,
      ]);
    });

    test("empty pcsets returns the note", () => {
      expect([10, 30, 40].map(Midi.pcsetNearest([]))).toEqual([]);
    });
  });

  test("Midi.pcsetSteps", () => {
    const scale = Midi.pcsetSteps("101010", 60);
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(scale)).toEqual([
      60, 62, 64, 72, 74, 76, 84, 86, 88, 96,
    ]);
    expect([0, -1, -2, -3, -4, -5, -6, -7, -8, -9].map(scale)).toEqual([
      60, 52, 50, 48, 40, 38, 36, 28, 26, 24,
    ]);
  });

  test("Midi.pcsetDegrees", () => {
    const scale = Midi.pcsetDegrees("101010", 60);
    expect([1, 2, 3, 4, 5].map(scale)).toEqual([60, 62, 64, 72, 74]);
    expect([-1, -2, -3, 4, 5].map(scale)).toEqual([52, 50, 48, 72, 74]);
    expect(scale(0)).toBe(undefined);
  });
});
