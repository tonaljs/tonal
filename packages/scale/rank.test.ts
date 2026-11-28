import { describe, expect, test } from "vitest";
import { get, rank } from "./index";

const names = (list: { name: string }[], n = list.length) =>
  list.slice(0, n).map((s) => s.name);

// A fixed shuffle, so the test doesn't depend on Math.random
const shuffle = <T>(list: T[], seed: number) => {
  const out = list.slice();
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const MAJORS = "C G D A E B F# C# F Bb Eb Ab Db Gb Cb".split(" ");
const MODES = [
  "major",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "minor",
  "locrian",
];

describe("Scale.rank", () => {
  test("the notes of a major scale", () => {
    expect(names(rank(["F", "G", "A", "Bb", "C", "D", "E"]), 3)).toEqual([
      "F major",
      "D minor",
      // the modes, the last note E first
      "E locrian",
    ]);
    // the notes start and end on D
    expect(rank(["D", "E", "F", "G", "A", "Bb", "C", "D"])[0].name).toBe(
      "D minor",
    );
    // a mode is never before the major and minor with the same notes
    expect(names(rank(["E", "F", "G", "A", "Bb", "C", "D"]), 3)).toEqual([
      "D minor",
      "F major",
      "E locrian",
    ]);
  });

  test("every mode of every major key, shuffled: the key in the top two", () => {
    for (const tonic of MAJORS) {
      const major = get(`${tonic} major`);
      const relative = `${major.notes[5]} minor`;
      MODES.forEach((mode, i) => {
        const modeTonic = major.notes[i];
        const notes = get(`${modeTonic} ${mode}`).notes;
        for (let seed = 1; seed <= 3; seed++) {
          const top = names(rank(shuffle(notes, seed + i)), 2);
          expect(top).toContain(`${tonic} major`);
          expect(top).toContain(relative);
        }
        // starting and ending on the major tonic, it's first
        const fromTonic = [...get(`${tonic} major`).notes, tonic];
        expect(rank(fromTonic)[0].name).toBe(`${tonic} major`);
      });
    }
  });

  test("chords", () => {
    expect(rank([], { chords: ["Dm7", "G7", "Cmaj7"] })[0].name).toBe(
      "C major",
    );
    expect(rank([], { chords: ["Am", "Dm", "E7"] })[0].name).toBe(
      "A harmonic minor",
    );
    // the chords decide between the relative major and minor
    expect(rank([], { chords: ["Am", "Dm", "Em", "Am"] })[0].name).toBe(
      "A minor",
    );
    expect(rank([], { chords: ["C", "Am", "F", "G", "C"] })[0].name).toBe(
      "C major",
    );
    // a chord outside the scale
    const [first] = rank(["C", "D", "E"], { chords: ["C", "Bb"] });
    expect(first.chordsOutside).toEqual([]);
    const c = rank(["C", "D", "E"], { chords: ["C", "Bb"], types: ["major"] });
    expect(c.find((s) => s.name === "C major")!.chordsOutside).toEqual(["Bb"]);
  });

  test("an exact fit first", () => {
    expect(names(rank(["C", "D", "E", "G", "A"]), 3)).toEqual([
      "C major pentatonic",
      "A minor pentatonic",
      "C major",
    ]);
    expect(names(rank(["A", "C", "D", "Eb", "E", "G"]), 2)).toEqual([
      "A minor blues",
      "C major blues",
    ]);
  });

  test("one note: the common scales on it first", () => {
    expect(names(rank(["C"]), 2)).toEqual(["C major", "C minor"]);
    expect(names(rank(["C4", "C5"]), 2)).toEqual(["C major", "C minor"]);
  });

  test("spelling", () => {
    const flats = names(rank(["Bb", "Eb", "F"]));
    expect(flats.some((n) => /#/.test(n))).toBe(false);
    expect(flats.slice(0, 2)).toEqual(["Bb major", "Bb minor"]);
    const sharps = names(rank(["F#", "C#", "G#"]));
    expect(sharps.some((n) => /b /.test(n) || /^[A-G]b/.test(n))).toBe(false);
    expect(sharps[0]).toBe("F# major");
  });

  test("the result", () => {
    expect(rank(["C", "D", "E", "G", "A"], { limit: 1 })).toEqual([
      {
        name: "C major pentatonic",
        tonic: "C",
        type: "major pentatonic",
        matched: 5,
        missing: [],
        outside: [],
        chordsOutside: [],
      },
    ]);
    const [cMajor] = rank(["C", "E", "G", "Bb"], { types: ["major"] }).filter(
      (s) => s.name === "C major",
    );
    expect(cMajor.matched).toBe(3);
    expect(cMajor.missing).toEqual(["D", "F", "A", "B"]);
    expect(cMajor.outside).toEqual(["Bb"]);
  });

  test("types and limit", () => {
    expect(
      names(
        rank(["D", "E", "F", "G", "A", "B", "C"], { types: ["dorian"] }),
        1,
      ),
    ).toEqual(["D dorian"]);
    // a type that isn't in the default tiers comes after them
    const list = rank(["C", "Db", "E", "F", "G", "Ab", "B"], {
      types: ["double harmonic major", "major"],
    });
    expect(list[0].name).toBe("C double harmonic major");
    expect(rank(["C"], { limit: 3 }).length).toBe(3);
    expect(rank(["C"], { limit: 0 })).toEqual([]);
  });

  test("the same arguments give the same result", () => {
    const notes = ["E", "G", "B", "D", "F#"];
    expect(rank(notes)).toEqual(rank(notes));
  });

  test("invalid", () => {
    expect(rank([])).toEqual([]);
    expect(rank(["nonsense"])).toEqual([]);
    expect(rank("C" as unknown as string[])).toEqual([]);
    expect(rank([], { chords: ["nonsense"] })).toEqual([]);
    expect(rank(["C"], { types: ["nonsense"] })).toEqual([]);
  });
});
