import { describe, expect, test } from "vitest";
import ChordType from "@tonaljs/chord-type";
import { transpose as transposeNote } from "@tonaljs/pitch-distance";
import {
  containing,
  get,
  noteOf,
  substitutes,
  tritoneSubstitute,
} from "./index";
import {
  backdoor,
  contained,
  passingDiminished,
  relatedTwo,
  secondaryDominant,
} from "./substitutes";

const ROOTS = "C Db D Eb E F F# G Ab A Bb B C# Gb Cb".split(" ");
const DOMINANTS = ["7", "9", "13", "7b9", "7#9", "7#11", "7b13", "7#5", "9#11"];

describe("Chord.tritoneSubstitute", () => {
  test("examples", () => {
    expect(tritoneSubstitute("G7")).toBe("Db7");
    expect(tritoneSubstitute("Db7")).toBe("G7");
    expect(tritoneSubstitute("C7")).toBe("Gb7");
    expect(tritoneSubstitute("F#7")).toBe("C7");
    expect(tritoneSubstitute("E7")).toBe("Bb7");
    expect(tritoneSubstitute("B7")).toBe("F7");
    expect(tritoneSubstitute("G7b9")).toBe("Db7b9");
    expect(tritoneSubstitute("G7/B")).toBe("Db7/F");
  });

  test("the substitute of the substitute is the chord", () => {
    for (const root of ROOTS) {
      for (const type of DOMINANTS) {
        const chord = root + type;
        const sub = tritoneSubstitute(chord);
        const back = tritoneSubstitute(sub);
        // a root with at most one accidental
        expect(get(sub).tonic!.length).toBeLessThanOrEqual(2);
        expect(get(sub).type).toBe(get(chord).type);
        // the same chord, spelled the same from a natural root
        expect(noteChroma(get(back).tonic!)).toBe(noteChroma(root));
        if (root.length === 1) expect(back).toBe(chord);
      }
    }
  });

  test("the 3rd and 7th swap", () => {
    for (const root of ROOTS) {
      const chord = root + "7";
      const sub = tritoneSubstitute(chord);
      expect([noteOf(sub, "b7"), noteOf(sub, "3")].map(noteChroma)).toEqual(
        [noteOf(chord, "3"), noteOf(chord, "b7")].map(noteChroma),
      );
    }
  });

  test("not a dominant", () => {
    expect(tritoneSubstitute("Gm7")).toBe("");
    expect(tritoneSubstitute("Cmaj7")).toBe("");
    expect(tritoneSubstitute("G7sus4")).toBe("");
    expect(tritoneSubstitute("7")).toBe("");
    expect(tritoneSubstitute("nonsense")).toBe("");
  });
});

const CHROMA: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
function noteChroma(n: string): number {
  const acc = n.slice(1);
  const alt = acc.split("").reduce((a, c) => a + (c === "#" ? 1 : -1), 0);
  return (CHROMA[n[0]] + alt + 12) % 12;
}

describe("approach chords", () => {
  test("secondaryDominant", () => {
    expect(secondaryDominant("Dm7")).toBe("A7");
    expect(secondaryDominant("C#m")).toBe("G#7");
    expect(secondaryDominant("C")).toBe("G7");
    expect(secondaryDominant("Ebmaj7")).toBe("Bb7");
    expect(secondaryDominant("Bm7b5")).toBe("");
    expect(secondaryDominant("Caug")).toBe("");
    expect(secondaryDominant("m7")).toBe("");
  });

  test("relatedTwo", () => {
    expect(relatedTwo("G7")).toBe("Dm7");
    expect(relatedTwo("G7", { minor: true })).toBe("Dm7b5");
    expect(relatedTwo("G7b9")).toBe("Dm7b5");
    expect(relatedTwo("G7b9", { minor: false })).toBe("Dm7");
    expect(relatedTwo("E7")).toBe("Bm7");
    expect(relatedTwo("Cmaj7")).toBe("");
  });

  test("backdoor", () => {
    expect(backdoor("C")).toBe("Bb7");
    expect(backdoor("Cmaj7")).toBe("Bb7");
    expect(backdoor("Ebmaj7")).toBe("Db7");
    expect(backdoor("Am")).toBe("G7");
    expect(backdoor("Bdim")).toBe("");
  });

  test("passingDiminished in every major key", () => {
    for (const root of ROOTS) {
      const degree = (ivl: string) => transposeNote(root, ivl);
      for (const [from, to] of [
        ["1P", "2M"],
        ["2M", "3M"],
        ["4P", "5P"],
        ["5P", "6M"],
      ]) {
        const dim = passingDiminished(degree(from), degree(to) + "m7");
        // the dim7 a half step below the target, spelled from it
        expect(dim).toBe(transposeNote(degree(to), "-2m") + "dim7");
        // its notes are a 7b9 on the target's dominant, without root
        const dominant = get(secondaryDominant(degree(to) + "m7") + "b9");
        expect(get(dim).notes).toEqual(dominant.notes.slice(1));
      }
    }
    expect(passingDiminished("C", "Dm7")).toBe("C#dim7");
    expect(passingDiminished("Fmaj7", "G7")).toBe("F#dim7");
    expect(passingDiminished("C", "Em7")).toBe("");
    expect(passingDiminished("C", "Ebb")).toBe("");
    expect(passingDiminished("C", "")).toBe("");
  });
});

describe("Chord.contained", () => {
  test("#115", () => {
    expect(contained("Cmaj7")).toEqual(["Em"]);
    expect(contained("G9")).toEqual(["Bm7b5", "Dm6"]);
  });

  test("examples", () => {
    expect(contained("C6")).toEqual(["Am7"]);
    expect(contained("Cmaj9")).toEqual(["Em7", "G6"]);
    expect(contained("Cm9")).toEqual(["Ebmaj7", "Eb6"]);
    expect(contained("G7")).toEqual(["Bdim"]);
    expect(contained("G7b9")).toEqual(["Bdim7"]);
    expect(contained("G13")).toEqual(["Bm7b5", "Dm6", "Em7"]);
    expect(contained("Bm7b5")).toEqual(["Dm6"]);
    expect(contained("Cdim7")).toEqual(["Ebdim"]);
    expect(contained("C")).toEqual([]);
    expect(contained("Cm")).toEqual([]);
    expect(contained("maj7")).toEqual([]);
  });

  test("every result is made of the chord's notes", () => {
    for (const type of ChordType.all()) {
      const chord = "C" + type.aliases[0];
      const notes = get(chord).notes;
      for (const c of contained(chord)) {
        expect(get(c).notes.every((n) => notes.includes(n))).toBe(true);
        expect(get(c).tonic).not.toBe("C");
      }
    }
  });
});

describe("Chord.containing", () => {
  test("examples", () => {
    expect(containing("C").slice(0, 4)).toEqual([
      { chord: "Cmaj7", degree: "1" },
      { chord: "Abmaj7", degree: "3" },
      { chord: "Fmaj7", degree: "5" },
      { chord: "Dbmaj7", degree: "7" },
    ]);
    expect(containing("C4").map((c) => c.chord)).toEqual(
      containing("C").map((c) => c.chord),
    );
    expect(
      containing("C", { types: ["m7"] }).map((c) => `${c.chord} ${c.degree}`),
    ).toEqual(["Cm7 1", "Am7 b3", "Fm7 5", "Dm7 b7", "Bbm7 9", "Gm7 11"]);
  });

  test("the note is at its degree", () => {
    for (const n of ROOTS) {
      const types = ["maj7", "7", "m7", "m7b5", "dim7", "6", "m6", "M"];
      for (const { chord, degree } of containing(n, { types })) {
        expect(noteChroma(noteOf(chord, degree))).toBe(noteChroma(n));
      }
    }
  });

  test("invalid", () => {
    expect(containing("nonsense")).toEqual([]);
    expect(containing("C", { types: ["nonsense"] })).toEqual([]);
  });
});

describe("Chord.substitutes", () => {
  test("a dominant", () => {
    expect(substitutes("G7")).toEqual([
      { chords: ["Db7"], kind: "tritone substitute" },
      { chords: ["Bb7"], kind: "backdoor" },
      { chords: ["Bdim"], kind: "contained" },
      { chords: ["Dm7", "G7"], kind: "related ii" },
    ]);
    expect(substitutes("G9").map((s) => s.chords)).toEqual([
      ["Db9"],
      ["Bb7"],
      ["Bm7b5"],
      ["Dm6"],
      ["Dm7", "G9"],
    ]);
  });

  test("with the next chord", () => {
    expect(substitutes("C", { next: "Dm7" })).toEqual([
      { chords: ["C", "A7"], kind: "secondary dominant" },
      { chords: ["C", "Eb7"], kind: "substitute dominant" },
      { chords: ["C", "C#dim7"], kind: "passing diminished" },
    ]);
    // G7 is already the dominant of C
    expect(substitutes("G7", { next: "C" }).map((s) => s.kind)).not.toContain(
      "secondary dominant",
    );
  });

  test("kinds", () => {
    expect(substitutes("G7", { kinds: ["tritone substitute"] })).toEqual([
      { chords: ["Db7"], kind: "tritone substitute" },
    ]);
    expect(
      substitutes("G9", { kinds: ["contained"] }).map((s) => s.chords[0]),
    ).toEqual(["Bm7b5", "Dm6"]);
    expect(
      substitutes("C", { next: "Dm7", kinds: ["passing diminished"] }),
    ).toEqual([{ chords: ["C", "C#dim7"], kind: "passing diminished" }]);
    // the order is the catalogue's, not the order of `kinds`
    expect(
      substitutes("G7", { kinds: ["related ii", "tritone substitute"] }).map(
        (s) => s.kind,
      ),
    ).toEqual(["tritone substitute", "related ii"]);
    expect(substitutes("G7", { kinds: [] })).toEqual([]);
  });

  test("minor", () => {
    expect(substitutes("G7", { kinds: ["related ii"], minor: true })).toEqual([
      { chords: ["Dm7b5", "G7"], kind: "related ii" },
    ]);
    expect(
      substitutes("G7b9", { kinds: ["related ii"], minor: false })[0].chords,
    ).toEqual(["Dm7", "G7b9"]);
  });

  test("no substitutes", () => {
    expect(substitutes("C")).toEqual([]);
    expect(substitutes("m7")).toEqual([]);
    expect(substitutes("nonsense")).toEqual([]);
  });
});
