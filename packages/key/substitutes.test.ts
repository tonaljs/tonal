import {
  get as getChord,
  substitutes as chordSubstitutes,
  tritoneSubstitute,
} from "@tonaljs/chord";
import { describe, expect, test } from "vitest";
import { borrowedChords, majorKey, minorKey, substitutes } from "./index";

const TONICS = "C G D A E B F# C# F Bb Eb Ab Db Gb Cb".split(" ");
const show = (list: { chords: string[]; kind: string }[]) =>
  list.map((s) => `${s.kind}: ${s.chords.join(" ")}`);

// The V7 a chord resolves to by the substitutes catalogue
const dominantOf = (chord: string) =>
  chordSubstitutes("C", { next: chord, kinds: ["secondary dominant"] })[0]
    ?.chords[1] ?? "G7";
const relatedTwo = (dominant: string, minor: boolean) =>
  chordSubstitutes(dominant, { kinds: ["related ii"], minor })[0]?.chords[0];

describe("the key's per-degree arrays", () => {
  test("are the chord substitutes of its chords", () => {
    for (const tonic of TONICS) {
      for (const key of [
        majorKey(tonic),
        minorKey(tonic).natural,
        minorKey(tonic).harmonic,
        minorKey(tonic).melodic,
      ]) {
        key.chords.forEach((chord, i) => {
          const dominant = key.secondaryDominants[i];
          if (!dominant) return;
          expect(dominantOf(chord)).toBe(dominant);
          const sub = key.substituteDominants[i];
          expect(tritoneSubstitute(dominant)).toBe(sub);
          if ("secondaryDominantsMinorRelative" in key) {
            const minor = getChord(chord).quality === "Minor";
            expect(relatedTwo(dominant, minor)).toBe(
              key.secondaryDominantsMinorRelative[i],
            );
            expect(relatedTwo(sub, false)).toBe(
              key.substituteDominantsMinorRelative[i],
            );
          }
        });
      }
    }
  });
});

describe("Key.borrowedChords", () => {
  test("a major key", () => {
    expect(borrowedChords("C major")).toEqual([
      { chord: "Dm7b5", numeral: "ii7b5", from: "C minor", replaces: ["ii7"] },
      {
        chord: "Ebmaj7",
        numeral: "bIIImaj7",
        from: "C minor",
        replaces: ["IV", "V7"],
      },
      { chord: "Fm7", numeral: "iv7", from: "C minor", replaces: ["IV"] },
      { chord: "Fm6", numeral: "iv6", from: "C minor", replaces: ["IV"] },
      { chord: "Gm7", numeral: "v7", from: "C minor", replaces: ["V7"] },
      {
        chord: "Abmaj7",
        numeral: "bVImaj7",
        from: "C minor",
        replaces: ["iv"],
      },
      { chord: "Bb7", numeral: "bVII7", from: "C minor", replaces: ["iv"] },
      {
        chord: "Dbmaj7",
        numeral: "bIImaj7",
        from: "C phrygian",
        replaces: ["iv"],
      },
      {
        chord: "Bbmaj7",
        numeral: "bVIImaj7",
        from: "C mixolydian",
        replaces: ["IV"],
      },
      {
        chord: "Cmaj7#11",
        numeral: "Imaj7#11",
        from: "C lydian",
        replaces: ["I"],
      },
    ]);
    expect(borrowedChords("C")).toEqual(borrowedChords("C major"));
  });

  test("a minor key", () => {
    expect(borrowedChords("A minor")).toEqual([
      { chord: "Amaj7", numeral: "Imaj7", from: "A major", replaces: ["i"] },
      { chord: "Bm7", numeral: "ii7", from: "A major", replaces: ["ii7b5"] },
      { chord: "Dmaj7", numeral: "IVmaj7", from: "A major", replaces: ["IV7"] },
    ]);
    expect(
      show(substitutes("E minor", "F#m7b5", { kinds: ["borrowed"] })),
    ).toEqual(["borrowed: F#m7"]);
    expect(show(substitutes("A minor", "D7", { kinds: ["borrowed"] }))).toEqual(
      ["borrowed: Dmaj7"],
    );
    // the iv is not replaced by IVmaj7
    expect(substitutes("A minor", "Dm7", { kinds: ["borrowed"] })).toEqual([]);
  });

  test("spelled in every key, the numerals the same", () => {
    const numerals = borrowedChords("C major").map((b) => b.numeral);
    for (const tonic of TONICS) {
      const list = borrowedChords(tonic + " major");
      expect(list.map((b) => b.numeral)).toEqual(numerals);
      for (const b of list) {
        expect(getChord(b.chord).empty).toBe(false);
        expect(b.from.startsWith(tonic + " ")).toBe(true);
      }
    }
  });

  test("invalid", () => {
    expect(borrowedChords("nonsense")).toEqual([]);
    expect(borrowedChords("C dorian")).toEqual([]);
  });
});

describe("Key.substitutes", () => {
  test("in a major key", () => {
    expect(show(substitutes("C major", "Fmaj7"))).toEqual([
      "contained: Am",
      "diatonic: Dm7",
      "borrowed: Ebmaj7",
      "borrowed: Fm7",
      "borrowed: Fm6",
      "borrowed: Bbmaj7",
    ]);
    expect(show(substitutes("C major", "G7"))).toEqual([
      "tritone substitute: Db7",
      "backdoor: Bb7",
      "contained: Bdim",
      "related ii: Dm7 G7",
      "diatonic: Bm7b5",
      "borrowed: Ebmaj7",
      "borrowed: Gm7",
    ]);
    // triads for a triad
    expect(show(substitutes("C major", "C"))).toEqual([
      "diatonic: Em",
      "diatonic: Am",
      "borrowed: Cmaj7#11",
    ]);
    // a chord of the key with more notes
    expect(show(substitutes("C major", "G9", { kinds: ["diatonic"] }))).toEqual(
      ["diatonic: Bm7b5"],
    );
  });

  test("in a minor key", () => {
    expect(show(substitutes("A minor", "Am7"))).toEqual([
      "contained: C6",
      "diatonic: Cmaj7",
      "borrowed: Amaj7",
    ]);
  });

  test("the related ii of a dominant to a minor chord", () => {
    expect(substitutes("C major", "E7", { kinds: ["related ii"] })).toEqual([
      { chords: ["Bm7b5", "E7"], kind: "related ii" },
    ]);
    expect(
      substitutes("C major", "E7", { kinds: ["related ii"], minor: false }),
    ).toEqual([{ chords: ["Bm7", "E7"], kind: "related ii" }]);
    expect(
      substitutes("C major", "A7", { kinds: ["related ii"] })[0].chords,
    ).toEqual(["Em7b5", "A7"]);
    expect(
      substitutes("C major", "D7", { kinds: ["related ii"] })[0].chords,
    ).toEqual(["Am7", "D7"]);
  });

  test("kinds and next", () => {
    expect(
      substitutes("C major", "C", {
        next: "Dm7",
        kinds: ["diatonic", "secondary dominant"],
      }),
    ).toEqual([
      { chords: ["C", "A7"], kind: "secondary dominant" },
      { chords: ["Em"], kind: "diatonic" },
      { chords: ["Am"], kind: "diatonic" },
    ]);
    expect(substitutes("C major", "G7", { kinds: ["borrowed"] }).length).toBe(
      2,
    );
    expect(substitutes("C major", "G7", { kinds: [] })).toEqual([]);
  });

  test("not in the key", () => {
    // no diatonic substitutes for a chord outside the key
    expect(substitutes("C major", "Ebmaj7", { kinds: ["diatonic"] })).toEqual(
      [],
    );
  });

  test("invalid", () => {
    expect(substitutes("nonsense", "C")).toEqual([]);
    expect(substitutes("C major", "nonsense")).toEqual([]);
  });
});
