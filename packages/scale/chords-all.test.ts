import { get as getChord } from "@tonaljs/chord";
import ChordType from "@tonaljs/chord-type";
import { chroma } from "@tonaljs/note";
import { describe, expect, test } from "vitest";
import { chords, get, names, scaleChords } from "./index";

const symbols = (list: { symbol: string }[]) => list.map((c) => c.symbol);

describe("Scale.chords with all", () => {
  test("#443: a key and a scale type to the chords to choose from", () => {
    expect(
      symbols(
        chords("B minor", { all: true, types: ["M", "m", "7", "m7", "maj7"] }),
      ),
    ).toEqual([
      "Bm",
      "Bm7",
      "D",
      "Dmaj7",
      "Em",
      "Em7",
      "F#m",
      "F#m7",
      "G",
      "Gmaj7",
      "A",
      "A7",
    ]);
  });

  test("by degree, the common chords first", () => {
    const list = chords("C major", { all: true });
    const degrees = list.map((c) => c.degree);
    expect(degrees).toEqual([...degrees].sort((a, b) => a - b));
    const seventh = symbols(list.filter((c) => c.degree === 7));
    expect(seventh[0]).toBe("Bdim");
    expect(seventh).toContain("Bm7b5");
    const complexity = (symbol: string) => getChord(symbol).complexity;
    for (let d = 1; d <= 7; d++) {
      const c = list
        .filter((x) => x.degree === d)
        .map((x) => complexity(x.symbol));
      expect(c).toEqual([...c].sort((a, b) => a - b));
    }
    // the dictionary's order
    const dictionary = chords("C major", { all: true, order: "dictionary" });
    expect(dictionary.length).toBe(list.length);
    const order = ChordType.all().map((t) => t.aliases[0]);
    const first = dictionary
      .filter((c) => c.degree === 1)
      .map((c) => c.symbol.slice(1) || "M");
    const at = first.map((t) =>
      order.indexOf(t === "M" ? ChordType.get("M").aliases[0] : t),
    );
    expect(at).toEqual([...at].sort((a, b) => a - b));
  });

  test("every chord's notes are in the scale, spelled as the chord", () => {
    for (const name of [
      "C major",
      "A harmonic minor",
      "Eb dorian",
      "F# lydian",
      "C diminished",
      "C altered",
      "D major pentatonic",
      "C chromatic",
      "E persian",
    ]) {
      const scale = get(name);
      const pcs = scale.notes.map(chroma);
      for (const c of chords(name, { all: true })) {
        expect(c.notes.every((n) => pcs.includes(chroma(n)))).toBe(true);
        // the notes of the symbol, on a scale note
        expect(c.notes).toEqual(getChord(c.symbol).notes);
        expect(scale.notes[c.degree - 1]).toBe(c.notes[0]);
      }
    }
    const pick = (scale: string, symbol: string) =>
      chords(scale, { all: true }).find((c) => c.symbol === symbol)?.notes;
    // the diminished scale has Gb, the chord F#
    expect(pick("C diminished", "D")).toEqual(["D", "F#", "A"]);
    expect(pick("C diminished", "Cdim7")).toEqual(["C", "Eb", "Gb", "Bbb"]);
    expect(pick("C altered", "Cm7b5")).toEqual(["C", "Eb", "Gb", "Bb"]);
  });

  test("on each degree, the triads before 5, sus and no5 chords", () => {
    const first = (scale: string, degree: number, n: number) =>
      symbols(
        chords(scale, { all: true }).filter((c) => c.degree === degree),
      ).slice(0, n);
    expect(first("C major", 1, 1)).toEqual(["C"]);
    expect(first("C major", 5, 1)).toEqual(["G"]);
    expect(first("C major", 2, 1)).toEqual(["Dm"]);
    expect(first("C major", 7, 1)).toEqual(["Bdim"]);
  });

  test("the stacked chords and the key's chords are among them", () => {
    for (const tonic of ["C", "Bb", "F#"]) {
      for (const type of [
        "major",
        "minor",
        "harmonic minor",
        "melodic minor",
        "dorian",
      ]) {
        const name = `${tonic} ${type}`;
        const all = chords(name, { all: true });
        for (const size of [3, 4]) {
          for (const stacked of chords(name, { size })) {
            if (!stacked.symbol) continue;
            const same = all.filter(
              (c) =>
                c.degree === stacked.degree &&
                c.notes.join() === stacked.notes.join(),
            );
            expect(same.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test("degree 1 has the types of Scale.scaleChords, for every scale type", () => {
    for (const type of names()) {
      const name = `C ${type}`;
      const onTonic = chords(name, { all: true })
        .filter((c) => c.degree === 1)
        .map((c) => c.symbol.slice(1) || ChordType.get("M").aliases[0]);
      const types = scaleChords(name);
      expect(onTonic).toEqual(expect.arrayContaining(types));
      // and the types with all the scale's notes, which scaleChords leaves out
      for (const extra of onTonic.filter((t) => !types.includes(t))) {
        expect(ChordType.get(extra).chroma).toBe(get(name).chroma);
      }
    }
  });

  test("with octaves", () => {
    expect(chords("C4 major", { all: true, types: ["maj7"] })).toEqual([
      { degree: 1, notes: ["C4", "E4", "G4", "B4"], symbol: "Cmaj7" },
      { degree: 4, notes: ["F4", "A4", "C5", "E5"], symbol: "Fmaj7" },
    ]);
  });

  test("invalid", () => {
    expect(chords("major", { all: true })).toEqual([]);
    expect(chords("C nonsense", { all: true })).toEqual([]);
    expect(chords("C major", { all: true, types: ["nonsense"] })).toEqual([]);
  });
});
