import { describe, expect, test } from "vitest";
import { topNoteDiff } from ".";
import { notes as chordNotes } from "@tonaljs/chord";
import { fromMidi } from "@tonaljs/note";
import * as VoiceLeading from ".";

describe("VoiceLeading", () => {
  test("topNoteDiff", () => {
    expect(
      topNoteDiff(
        [
          ["F3", "A3", "C4", "E4"],
          ["C4", "E4", "F4", "A4"],
        ],
        ["C4", "E4", "G4", "B4"],
      ),
    ).toEqual(["C4", "E4", "F4", "A4"]);
  });

  test("topNoteDiff doesn't change the given voicings", () => {
    const voicings = [
      ["A3", "B4"],
      ["C4", "D4"],
      ["E4", "G4"],
    ];
    const copy = voicings.map((v) => [...v]);
    expect(topNoteDiff(voicings, ["C4", "F4"])).toEqual(["E4", "G4"]);
    expect(voicings).toEqual(copy);
  });

  test("topNoteDiff picks the first voicing on a tie", () => {
    expect(
      topNoteDiff(
        [
          ["C4", "D4"],
          ["C4", "F#4"],
          ["C4", "E4"],
        ],
        ["F4"],
      ),
    ).toEqual(["C4", "F#4"]);
  });

  test("topNoteDiff with no voicings", () => {
    expect(topNoteDiff([], ["C4"])).toEqual([]);
    expect(topNoteDiff([], [])).toEqual([]);
  });
});

// A small deterministic random generator (no Math.random in tests)
function random(seed: number) {
  let s = seed;
  return (n: number) => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s % n;
  };
}
const voicing = (rnd: (n: number) => number, size: number) =>
  Array.from({ length: size }, () => fromMidi(48 + rnd(25)));

// Every permutation of a list
function permutations<T>(list: T[]): T[][] {
  if (list.length <= 1) return [list];
  return list.flatMap((x, i) =>
    permutations([...list.slice(0, i), ...list.slice(i + 1)]).map((p) => [
      x,
      ...p,
    ]),
  );
}

describe("VoiceLeading.get and distance", () => {
  test("moves each voice to the voice in the same position", () => {
    expect(VoiceLeading.get(["C4", "E4", "G4"], ["B3", "D4", "G4"])).toEqual({
      distance: 3,
      moves: [
        ["C4", "B3"],
        ["E4", "D4"],
        ["G4", "G4"],
      ],
    });
    // the order of the notes doesn't matter
    expect(VoiceLeading.distance(["G4", "C4", "E4"], ["D4", "G4", "B3"])).toBe(
      3,
    );
  });

  test("metrics", () => {
    const a = ["C4", "E4", "G4"];
    const b = ["B3", "D4", "G4"];
    expect(VoiceLeading.distance(a, b, { metric: "L1" })).toBe(3);
    expect(VoiceLeading.distance(a, b, { metric: "L2" })).toBeCloseTo(
      Math.sqrt(5),
    );
    expect(VoiceLeading.distance(a, b, { metric: "Linf" })).toBe(2);
  });

  test("different sizes double notes of the smaller voicing", () => {
    expect(
      VoiceLeading.get(["C4", "E4", "G4"], ["C4", "E4", "G4", "B4"]),
    ).toEqual({
      distance: 4,
      moves: [
        ["C4", "C4"],
        ["E4", "E4"],
        ["G4", "G4"],
        ["G4", "B4"],
      ],
    });
    expect(
      VoiceLeading.distance(["C4", "E4", "G4", "B4"], ["C4", "E4", "G4"]),
    ).toBe(4);
  });

  test("invalid voicings", () => {
    expect(VoiceLeading.get([], ["C4"])).toEqual({ distance: null, moves: [] });
    expect(VoiceLeading.distance(["C4", "E4"], ["C"])).toBe(null);
    expect(VoiceLeading.distance(["C4"], ["x"])).toBe(null);
  });

  test("laws: zero, symmetry, triangle inequality, minimal", () => {
    const rnd = random(1);
    for (let i = 0; i < 200; i++) {
      const size = 2 + rnd(3);
      const [a, b, c] = [
        voicing(rnd, size),
        voicing(rnd, size),
        voicing(rnd, size),
      ];
      for (const metric of ["L1", "L2", "Linf"] as const) {
        const d = (x: string[], y: string[]) =>
          VoiceLeading.distance(x, y, { metric }) as number;
        expect(d(a, a)).toBe(0);
        expect(d(a, b)).toBeCloseTo(d(b, a));
        expect(d(a, c)).toBeLessThanOrEqual(d(a, b) + d(b, c) + 1e-9);
      }
      // no matching of the voices is smaller (brute force)
      const brute = Math.min(
        ...permutations(b).map((p) =>
          a.reduce(
            (sum, n, j) =>
              sum + Math.abs(VoiceLeading.distance([n], [p[j]]) as number),
            0,
          ),
        ),
      );
      expect(VoiceLeading.distance(a, b)).toBe(brute);
    }
  });
});

describe("VoiceLeading.pcDistance", () => {
  test("neo-Riemannian moves: P and L cost 1, R costs 2", () => {
    const pc = (a: string, b: string) =>
      VoiceLeading.pcDistance(chordNotes(a), chordNotes(b));
    expect(pc("C", "Cm")).toBe(1); // P
    expect(pc("C", "Em")).toBe(1); // L
    expect(pc("C", "Am")).toBe(2); // R
    expect(pc("C", "F")).toBe(3);
    expect(pc("Dm7", "G7")).toBe(3);
    expect(pc("G7", "Cmaj7")).toBe(3);
  });

  test("octaves and repeated pitch classes don't count", () => {
    expect(
      VoiceLeading.pcDistance(["C2", "E5", "G3", "C6"], ["C", "E", "A"]),
    ).toBe(2);
  });

  test("different sizes", () => {
    expect(VoiceLeading.pcDistance(["C", "E", "G"], ["C", "E", "G", "B"])).toBe(
      1,
    );
  });

  test("invalid input", () => {
    expect(VoiceLeading.pcDistance([], ["C"])).toBe(null);
    expect(VoiceLeading.pcDistance(["C", "x"], ["C"])).toBe(null);
  });

  test("laws: the smallest over every matching of the notes (brute force)", () => {
    const rnd = random(2);
    const move = (a: number, b: number) => {
      const up = (((b - a) % 12) + 12) % 12;
      return Math.min(up, 12 - up);
    };
    for (let i = 0; i < 300; i++) {
      const size = 2 + rnd(4);
      const pcs = (n: number) => {
        const set = new Set<number>();
        while (set.size < n) set.add(rnd(12));
        return [...set];
      };
      const [a, b] = [pcs(size), pcs(size)];
      const names = (list: number[]) => list.map((c) => fromMidi(60 + c));
      const brute = Math.min(
        ...permutations(b).map((p) =>
          a.reduce((s, x, j) => s + move(x, p[j]), 0),
        ),
      );
      expect(VoiceLeading.pcDistance(names(a), names(b))).toBe(brute);
      expect(VoiceLeading.pcDistance(names(b), names(a))).toBe(brute);
    }
  });
});

describe("VoiceLeading.path", () => {
  const candidates = [
    [["C4", "E4", "G4"]],
    [
      ["F4", "A4", "C5"],
      ["C4", "F4", "A4"],
    ],
    [
      ["G4", "B4", "D5"],
      ["B3", "D4", "G4"],
    ],
  ];

  test("the smoothest path", () => {
    expect(VoiceLeading.path(candidates)).toEqual({
      voicings: [
        ["C4", "E4", "G4"],
        ["C4", "F4", "A4"],
        ["B3", "D4", "G4"],
      ],
      cost: 9,
      steps: [0, 3, 6],
    });
  });

  test("never worse than greedy, and equal to brute force", () => {
    const rnd = random(3);
    for (let i = 0; i < 100; i++) {
      const chords = Array.from({ length: 2 + rnd(3) }, () =>
        Array.from({ length: 1 + rnd(4) }, () => voicing(rnd, 3)),
      );
      const d = (a: string[], b: string[]) =>
        VoiceLeading.distance(a, b) as number;
      // brute force over every combination
      const all = chords.reduce<string[][][]>(
        (paths, list) => paths.flatMap((p) => list.map((v) => [...p, v])),
        [[]],
      );
      const cost = (p: string[][]) =>
        p.slice(1).reduce((s, v, j) => s + d(p[j], v), 0);
      const best = Math.min(...all.map(cost));
      // greedy: the closest candidate at each step
      const greedy = chords.slice(1).reduce(
        (p, list) => {
          const prev = p[p.length - 1];
          const next = list.reduce((x, v) => (d(prev, v) < d(prev, x) ? v : x));
          return [...p, next];
        },
        [chords[0][0]],
      );
      const result = VoiceLeading.path(chords);
      expect(result.cost).toBe(best);
      expect(cost(result.voicings)).toBe(best);
      expect(result.cost).toBeLessThanOrEqual(cost(greedy));
      expect(result.steps.reduce((s, x) => s + x, 0)).toBe(best);
    }
  });

  test("previous voicing", () => {
    const result = VoiceLeading.path([candidates[1]], {
      previous: ["E4", "G4", "C5"],
    });
    expect(result.voicings).toEqual([["F4", "A4", "C5"]]);
    expect(result.cost).toBe(3);
  });

  test("costs of the candidates", () => {
    const result = VoiceLeading.path(candidates, {
      costs: [[0], [0, 100], [0, 0]],
    });
    expect(result.voicings[1]).toEqual(["F4", "A4", "C5"]);
  });

  test("maxLeap skips large moves unless every candidate needs one", () => {
    const result = VoiceLeading.path(
      [
        [["C4", "E4", "G4"]],
        [
          ["C5", "E5", "G5"],
          ["B3", "D4", "G4"],
        ],
      ],
      { maxLeap: 2 },
    );
    expect(result.voicings[1]).toEqual(["B3", "D4", "G4"]);
    const forced = VoiceLeading.path(
      [[["C4", "E4", "G4"]], [["C5", "E5", "G5"]]],
      { maxLeap: 2 },
    );
    expect(forced.voicings[1]).toEqual(["C5", "E5", "G5"]);
  });

  test("maxLeap doesn't lead from a skipped candidate", () => {
    // A5 is skipped, so every candidate of the last chord needs a large move
    const result = VoiceLeading.path(
      [[["C4"]], [["D4"], ["A5"]], [["G5"], ["E5"]]],
      { maxLeap: 4 },
    );
    expect(result).toEqual({
      voicings: [["C4"], ["D4"], ["E5"]],
      cost: 16,
      steps: [0, 2, 14],
    });
  });

  test("chords without candidates", () => {
    expect(
      VoiceLeading.path([
        [["C4", "E4", "G4"]],
        [],
        [
          ["C4", "F4", "A4"],
          ["F4", "A4", "C5"],
        ],
      ]),
    ).toEqual({
      voicings: [["C4", "E4", "G4"], [], ["C4", "F4", "A4"]],
      cost: 3,
      steps: [0, 0, 3],
    });
    expect(VoiceLeading.path([])).toEqual({ voicings: [], cost: 0, steps: [] });
    expect(VoiceLeading.path([[], [["x"]]])).toEqual({
      voicings: [[], []],
      cost: 0,
      steps: [0, 0],
    });
  });

  test("ties keep the first candidate", () => {
    const result = VoiceLeading.path([[["C4"]], [["B3"], ["C#4"]]]);
    expect(result.voicings[1]).toEqual(["B3"]);
  });
});
