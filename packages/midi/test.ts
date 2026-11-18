import { describe, expect, test } from "vitest";
import * as Midi from "./index";

describe("midi", () => {
  test("isMidi", () => {
    expect(Midi.isMidi(100)).toBe(true);
    expect(Midi.isMidi("100")).toBe(true);
    expect(Midi.isMidi(0)).toBe(true);
    expect(Midi.isMidi("")).toBe(false);
    expect(Midi.isMidi(" ")).toBe(false);
    expect(Midi.isMidi(null)).toBe(false);
    expect(Midi.isMidi(undefined)).toBe(false);
    expect(Midi.isMidi([])).toBe(false);
    expect(Midi.isMidi(true)).toBe(false);
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
    expect(Midi.toMidi("")).toBe(null);
    expect(Midi.toMidi(" ")).toBe(null);
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
      "C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4 Bb4 B4 C5",
    );
    expect(
      notes.map((n) => Midi.midiToNoteName(n, { sharps: true })).join(" "),
    ).toEqual("C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5");
    expect(
      notes.map((n) => Midi.midiToNoteName(n, { pitchClass: true })).join(" "),
    ).toEqual("C Db D Eb E F Gb G Ab A Bb B C");

    expect(Midi.midiToNoteName(NaN)).toEqual("");
    expect(Midi.midiToNoteName(-Infinity)).toEqual("");
    expect(Midi.midiToNoteName(Infinity)).toEqual("");
  });

  test("midiToNoteName with negative numbers", () => {
    expect(Midi.midiToNoteName(-1)).toEqual("B-2");
    expect(Midi.midiToNoteName(-1, { sharps: true })).toEqual("B-2");
    expect(Midi.midiToNoteName(-4, { pitchClass: true })).toEqual("Ab");
    expect(Midi.midiToNoteName(-12)).toEqual("C-2");
    expect(Midi.midiToNoteName(-13)).toEqual("B-3");
  });

  test("chroma", () => {
    expect([60, 61, 72, 0, 11].map(Midi.chroma)).toEqual([0, 1, 0, 0, 11]);
    expect([-1, -4, -12, -13].map(Midi.chroma)).toEqual([11, 8, 0, 11]);
  });

  describe("Midi.pcset", () => {
    test("from chroma", () => {
      expect(Midi.pcset("100100100101")).toEqual([0, 3, 6, 9, 11]);
    });
    test("from midi", () => {
      expect(Midi.pcset([62, 63, 60, 65, 70, 72])).toEqual([0, 2, 3, 5, 10]);
    });
    test("from negative midi", () => {
      expect(Midi.pcset([-1, -12, -8, 4])).toEqual([0, 4, 11]);
    });
  });

  describe("Midi.pcsetNearest", () => {
    test("find nearest upwards", () => {
      const nearest = Midi.pcsetNearest([0, 5, 7]);
      expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(nearest)).toEqual([
        0, 0, 0, 5, 5, 5, 7, 7, 7, 7, 12, 12, 12,
      ]);
    });

    test("chromatic to nearest C minor pentatonic", () => {
      const nearest = Midi.pcsetNearest("100101010010");
      expect(
        [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47].map(nearest),
      ).toEqual([36, 36, 39, 39, 41, 41, 43, 43, 43, 46, 46, 48]);
    });

    test("chromatic to nearest half octave", () => {
      const nearest = Midi.pcsetNearest("100000100000");
      expect(
        [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47].map(nearest),
      ).toEqual([36, 36, 36, 42, 42, 42, 42, 42, 42, 48, 48, 48]);
    });

    test("below midi 0", () => {
      const nearest = Midi.pcsetNearest([2]);
      expect([-1, -10, -11, -12, -13].map(nearest)).toEqual([
        2, -10, -10, -10, -10,
      ]);
      expect(
        [-12, -11, -10, -9, -8, -7].map(Midi.pcsetNearest([0, 7])),
      ).toEqual([-12, -12, -12, -12, -5, -5]);
    });

    test("decimal midi numbers", () => {
      const nearest = Midi.pcsetNearest([0, 2, 4, 5, 7, 9, 11]);
      expect([59.96, 60.4, 60.6, 61.4, 63.5, 65.5].map(nearest)).toEqual([
        60, 60, 60, 62, 64, 65,
      ]);
      expect(nearest(Midi.freqToMidi(261))).toEqual(60);
      expect(Midi.pcsetNearest([0, 2])(60.6)).toEqual(60);
      expect(Midi.pcsetNearest([0, 2])(61)).toEqual(62);
    });

    test("not a number", () => {
      const nearest = Midi.pcsetNearest([0, 4, 7]);
      expect([NaN, Infinity, -Infinity].map(nearest)).toEqual([
        undefined,
        undefined,
        undefined,
      ]);
    });

    test("empty pcsets returns the note", () => {
      expect([10, 30, 40].map(Midi.pcsetNearest([]))).toEqual([
        undefined,
        undefined,
        undefined,
      ]);
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
