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
    expect(notes.map(m => Midi.midiToNoteName(m)).join(" ")).toEqual(
      "C4 Db4 D4 Eb4 E4 F4 Gb4 G4 Ab4 A4 Bb4 B4 C5"
    );
    expect(
      notes.map(n => Midi.midiToNoteName(n, { sharps: true })).join(" ")
    ).toEqual("C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5");
    expect(
      notes.map(n => Midi.midiToNoteName(n, { pitchClass: true })).join(" ")
    ).toEqual("C Db D Eb E F Gb G Ab A Bb B C");
  });
});
