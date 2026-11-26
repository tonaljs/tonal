import { describe, expect, it, vi } from "vitest";
import * as R from "./index";

const sequential = (start: number, step: number) => {
  let current = start;
  return () => (current += step);
};

describe("rhythm-pattern", () => {
  it("generates binary rhythms", () => {
    expect(R.binary(13)).toEqual([1, 1, 0, 1]);
    expect(R.binary(12, 13)).toEqual([1, 1, 0, 0, 1, 1, 0, 1]);
  });

  it("generates hexadecimal patterns", () => {
    expect(R.hex("8f")).toEqual([1, 0, 0, 0, 1, 1, 1, 1]);
  });

  it("generates rhythms from onset spaces (deprecated)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(R.onsets(1, 2, 2, 1)).toEqual([1, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
    expect(warn).toHaveBeenCalledWith(
      "RhythmPattern.onsets is deprecated. Use RhythmPattern.fromDurations with each number + 1.",
    );
    // the replacement it names gives the same pattern
    expect(R.fromDurations([2, 3, 3, 2])).toEqual(R.onsets(1, 2, 2, 1));
    warn.mockRestore();
  });

  it("generates random patterns", () => {
    expect(R.random(10)).toHaveLength(10);
    const rnd = sequential(0.25, 0.1);
    expect(R.random(5, 0.5, rnd)).toEqual([0, 0, 1, 1, 1]);
  });

  it("generates probabilistic patterns", () => {
    const rnd = () => 0.5;
    expect(R.probability([0.5, 0.2, 0, 1, 0], rnd)).toEqual([1, 0, 0, 1, 0]);
  });

  it("rotates pattern", () => {
    expect(R.rotate([1, 0, 0, 1], 0)).toEqual([1, 0, 0, 1]);
    expect(R.rotate([1, 0, 0, 1], 1)).toEqual([1, 1, 0, 0]);
    expect(R.rotate([1, 0, 0, 1], 2)).toEqual([0, 1, 1, 0]);
    expect(R.rotate([1, 0, 0, 1], 3)).toEqual([0, 0, 1, 1]);
    expect(R.rotate([1, 0, 0, 1], 4)).toEqual([1, 0, 0, 1]);
    expect(R.rotate([1, 0, 0, 1], -1)).toEqual([0, 0, 1, 1]);
    expect(R.rotate([1, 0, 0, 1], -2)).toEqual([0, 1, 1, 0]);
  });

  it("generates euclidian patterns", () => {
    expect(R.euclid(8, 3)).toEqual([1, 0, 0, 1, 0, 0, 1, 0]);
  });

  it("generates euclidian patterns without beats", () => {
    expect(R.euclid(4, 0)).toEqual([0, 0, 0, 0]);
    expect(R.euclid(8, 0)).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    expect(R.euclid(4, -1)).toEqual([0, 0, 0, 0]);
    expect(R.euclid(4, 4)).toEqual([1, 1, 1, 1]);
    expect(R.euclid(0, 0)).toEqual([]);
  });
});

// The six timelines of Toussaint's The Geometry of Musical Rhythm (ch. 7), as
// durations in a loop of 16 steps
const TIMELINES = {
  shiko: [4, 2, 4, 2, 4],
  son: [3, 3, 4, 2, 4],
  rumba: [3, 4, 3, 2, 4],
  soukous: [3, 3, 4, 1, 5],
  gahu: [3, 3, 4, 4, 2],
  bossa: [3, 3, 4, 3, 3],
};
type Timeline = keyof typeof TIMELINES;
const timeline = (name: Timeline) => R.fromDurations(TIMELINES[name]);
const names = Object.keys(TIMELINES) as Timeline[];
const byName = (fn: (p: R.RhythmPattern) => unknown) =>
  Object.fromEntries(names.map((name) => [name, fn(timeline(name))]));

// Scale chromas as patterns of 12 steps
const MAJOR = "101011010101".split("").map(Number);
const PENTATONIC = "101010010100".split("").map(Number);

describe("onsets and durations (#483)", () => {
  it("creates patterns from durations", () => {
    expect(R.fromDurations([3, 3, 2])).toEqual([1, 0, 0, 1, 0, 0, 1, 0]);
    expect(R.fromDurations([1, 2, 2, 1])).toEqual([1, 1, 0, 1, 0, 1]);
    expect(R.fromDurations([2, 0, 1])).toEqual([1, 0, 1]);
    expect(R.fromDurations([])).toEqual([]);
  });

  it("creates patterns from onset positions", () => {
    expect(R.fromOnsets([0, 3, 6], 8)).toEqual([1, 0, 0, 1, 0, 0, 1, 0]);
    expect(R.fromOnsets([0, 2, 5, 8], 10)).toEqual([
      1, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    ]);
    expect(R.fromOnsets([0, 2, 5, 8])).toEqual([1, 0, 1, 0, 0, 1, 0, 0, 1]);
    expect(R.fromOnsets([2, 0])).toEqual([1, 0, 1]);
    expect(R.fromOnsets([1, 1])).toEqual([0, 1]);
    expect(R.fromOnsets([0, 3], 2)).toEqual([1, 0]);
    expect(R.fromOnsets([], 3)).toEqual([0, 0, 0]);
    expect(R.fromOnsets([])).toEqual([]);
  });

  it("reads onsets and durations", () => {
    expect(R.toOnsets([1, 0, 0, 1, 0, 0, 1, 0])).toEqual([0, 3, 6]);
    expect(R.toDurations([1, 0, 0, 1, 0, 0, 1, 0])).toEqual([3, 3, 2]);
    // a loop: the rests before the first onset belong to the last one
    expect(R.toDurations([0, 1, 0, 1])).toEqual([2, 2]);
    expect(R.toDurations([0, 0, 1, 0])).toEqual([4]);
    expect(R.toDurations([0, 0])).toEqual([]);
    expect(R.toOnsets([])).toEqual([]);
  });

  it("round-trips", () => {
    for (const name of names) {
      const p = timeline(name);
      expect(R.toDurations(p)).toEqual(TIMELINES[name]);
      expect(R.fromDurations(R.toDurations(p))).toEqual(p);
      expect(R.fromOnsets(R.toOnsets(p), p.length)).toEqual(p);
      expect(p).toHaveLength(16);
    }
    for (let n = 1; n <= 12; n++) {
      for (let k = 0; k <= n; k++) {
        const p = R.rotate(R.euclid(n, k), k);
        expect(R.fromOnsets(R.toOnsets(p), n)).toEqual(p);
        expect(R.toDurations(p).reduce((a, b) => a + b, 0)).toBe(k ? n : 0);
      }
    }
  });

  it("gives empty values for invalid input", () => {
    expect(R.fromDurations([1, -1])).toEqual([]);
    expect(R.fromDurations([1.5])).toEqual([]);
    expect(R.fromDurations("3 3 2" as unknown as number[])).toEqual([]);
    expect(R.fromOnsets([0, -1])).toEqual([]);
    expect(R.fromOnsets([0.5])).toEqual([]);
    expect(R.fromOnsets([0], -1)).toEqual([]);
    expect(R.fromOnsets(3 as unknown as number[])).toEqual([]);
    expect(R.toOnsets([1, 2])).toEqual([]);
    expect(R.toDurations([1, 2])).toEqual([]);
    expect(R.toDurations(undefined as unknown as number[])).toEqual([]);
    expect(R.toDurations(null as unknown as number[])).toEqual([]);
  });
});

describe("rhythm measures (Toussaint)", () => {
  it("complement", () => {
    expect(R.complement([1, 0, 0, 1, 0, 0, 1, 0])).toEqual([
      0, 1, 1, 0, 1, 1, 0, 1,
    ]);
    const son = timeline("son");
    expect(R.complement(R.complement(son))).toEqual(son);
    expect(R.complement([1, 2])).toEqual([]);
  });

  it("necklace", () => {
    expect(R.necklace([0, 1, 0, 0, 1, 0, 0, 1])).toEqual([
      1, 0, 1, 0, 0, 1, 0, 0,
    ]);
    const son = timeline("son");
    for (let r = 0; r < 16; r++) {
      expect(R.necklace(R.rotate(son, r))).toEqual(R.necklace(son));
    }
    expect(R.necklace(son)).not.toEqual(R.necklace(timeline("rumba")));
    expect(R.necklace([])).toEqual([]);
    expect(R.necklace([1, 2])).toEqual([]);
  });

  it("interval vector", () => {
    // ch. 8: the clave son
    expect(R.intervalVector(timeline("son"))).toEqual([0, 1, 2, 2, 0, 3, 2, 0]);
    // ch. 37, fig. 37.5: the sorted histograms
    expect(
      byName((p) => [...R.intervalVector(p)].sort((a, b) => a - b).join("")),
    ).toEqual({
      shiko: "00001234",
      son: "00012223",
      rumba: "00111223",
      soukous: "01111222",
      gahu: "01111222",
      bossa: "00001234",
    });
    // ch. 37: distinct distances
    expect(
      byName((p) => R.intervalVector(p).filter((c) => c > 0).length),
    ).toEqual({ shiko: 4, son: 5, rumba: 6, soukous: 7, gahu: 7, bossa: 4 });
    expect(R.intervalVector(MAJOR)).toEqual([2, 5, 4, 3, 6, 1]);
    expect(R.intervalVector([1])).toEqual([]);
    expect(R.intervalVector([1, 2])).toEqual([]);
  });

  it("maximal evenness", () => {
    expect(R.isMaximallyEven([1, 0, 0, 1, 0, 0, 1, 0])).toBe(true);
    expect(R.isMaximallyEven([1, 1, 0, 1, 0, 0, 0, 0])).toBe(false);
    expect(byName(R.isMaximallyEven)).toEqual({
      shiko: false,
      son: false,
      rumba: false,
      soukous: false,
      gahu: false,
      bossa: true,
    });
    expect(R.isMaximallyEven(MAJOR)).toBe(true);
    expect(R.isMaximallyEven(PENTATONIC)).toBe(true);
    for (let n = 1; n <= 24; n++) {
      for (let k = 0; k <= n; k++) {
        const p = R.euclid(n, k);
        expect(R.isMaximallyEven(p)).toBe(true);
        expect(R.isMaximallyEven(R.rotate(p, 5))).toBe(true);
      }
    }
    expect(R.isMaximallyEven([])).toBe(false);
    expect(R.isMaximallyEven([1, 2])).toBe(false);
  });

  it("evenness", () => {
    const ev = byName(R.evenness) as Record<Timeline, number>;
    expect(ev.bossa).toBe(1);
    // ch. 18: "the bossa-nova is more even than the son, which is in turn
    // more even than the soukous"
    expect(ev.bossa).toBeGreaterThan(ev.son);
    expect(ev.son).toBeGreaterThan(ev.soukous);
    expect(R.evenness(MAJOR)).toBe(1);
    // the same for every rotation
    const son = timeline("son");
    for (let r = 0; r < 16; r++) {
      expect(R.evenness(R.rotate(son, r))).toBeCloseTo(ev.son, 12);
    }
    // bunched onsets are the least even
    expect(R.evenness(R.fromOnsets([0, 1, 2, 3, 4], 16))).toBeLessThan(0.5);
    expect(R.evenness([0, 0, 0])).toBe(1);
    expect(R.evenness([1, 0, 0])).toBe(1);
    expect(R.evenness([])).toBe(null);
    expect(R.evenness([1, 2])).toBe(null);
  });

  it("deepness", () => {
    expect(byName(R.isDeep)).toEqual({
      shiko: true,
      son: false,
      rumba: false,
      soukous: false,
      gahu: false,
      bossa: true,
    });
    expect(R.isDeep(MAJOR)).toBe(true);
    expect(R.isDeep(PENTATONIC)).toBe(true);
    // ch. 25: "I Got Rhythm"
    expect(R.isDeep(R.fromOnsets([2, 5, 8, 11], 16))).toBe(true);
    expect(R.isDeep([1, 0, 0])).toBe(false);
    expect(R.isDeep([1, 2])).toBe(false);
  });

  it("rhythmic oddity", () => {
    // ch. 37
    expect(byName(R.hasOddity)).toEqual({
      shiko: false,
      son: true,
      rumba: true,
      soukous: false,
      gahu: false,
      bossa: true,
    });
    expect(byName(R.oddity)).toEqual({
      shiko: 6,
      son: 7,
      rumba: 5,
      soukous: 5,
      gahu: 4,
      bossa: 6,
    });
    expect(R.hasOddity([1, 0, 0])).toBe(true);
    expect(R.oddity([1, 0, 0])).toBe(null);
    expect(R.hasOddity([])).toBe(false);
    expect(R.oddity([])).toBe(null);
    expect(R.oddity([1, 2])).toBe(null);
  });

  it("off-beatness", () => {
    // ch. 37
    expect(byName(R.offbeatness)).toEqual({
      shiko: 0,
      son: 1,
      rumba: 2,
      soukous: 2,
      gahu: 1,
      bossa: 2,
    });
    // ch. 16: the bembé (the major scale's pattern) has onsets on 5, 7 and 11
    expect(R.offbeatness(MAJOR)).toBe(3);
    expect(R.offbeatness([1])).toBe(0);
    expect(R.offbeatness([])).toBe(null);
  });

  it("distance", () => {
    // ch. 33: shiko to gahu
    expect(R.distance(timeline("shiko"), timeline("gahu"), "swap")).toBe(3);
    expect(R.distance([1, 0, 1, 0], [1, 1, 0, 0])).toBe(2);
    expect(R.distance([1, 0, 1, 0], [1, 1, 0, 0], "hamming")).toBe(2);
    for (const a of names) {
      for (const b of names) {
        const d = R.distance(timeline(a), timeline(b), "swap");
        expect(d).toBe(R.distance(timeline(b), timeline(a), "swap"));
        if (a === b) expect(d).toBe(0);
      }
    }
    expect(R.distance([1, 0], [1, 0, 0])).toBe(null);
    expect(R.distance([1, 0], [1, 1], "swap")).toBe(null);
    expect(
      R.distance([1, 0], [0, 1], "x" as unknown as R.RhythmDistanceMetric),
    ).toBe(null);
    expect(R.distance([1, 2], [1, 0])).toBe(null);
  });
});
