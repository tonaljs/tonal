import { steps as chordSteps } from "@tonaljs/chord";
import { steps as scaleSteps } from "@tonaljs/scale";
import { describe, expect, test } from "vitest";
import * as Pattern from "./index";

const { arpeggio, arpeggios, sequence, alternate, repeat } = Pattern;

describe("@tonaljs/pattern", () => {
  describe("arpeggio", () => {
    test("names", () => {
      expect(arpeggios()).toEqual([
        "up",
        "down",
        "up-down",
        "down-up",
        "up-down-repeat",
        "down-up-repeat",
        "converge",
        "diverge",
        "converge-diverge",
        "thumb-up",
        "thumb-up-down",
        "pinky-up",
        "pinky-up-down",
      ]);
    });

    test("over 3 and 4 notes", () => {
      const orders = (n: number) =>
        Object.fromEntries(
          arpeggios().map((name) => [name, arpeggio(name, n)]),
        );
      expect(orders(3)).toEqual({
        up: [0, 1, 2],
        down: [2, 1, 0],
        "up-down": [0, 1, 2, 1],
        "down-up": [2, 1, 0, 1],
        "up-down-repeat": [0, 1, 2, 2, 1, 0],
        "down-up-repeat": [2, 1, 0, 0, 1, 2],
        converge: [0, 2, 1],
        diverge: [1, 2, 0],
        "converge-diverge": [0, 2, 1, 2],
        "thumb-up": [0, 1, 0, 2],
        "thumb-up-down": [0, 1, 0, 2],
        "pinky-up": [0, 2, 1, 2],
        "pinky-up-down": [0, 2, 1, 2],
      });
      expect(orders(4)).toEqual({
        up: [0, 1, 2, 3],
        down: [3, 2, 1, 0],
        "up-down": [0, 1, 2, 3, 2, 1],
        "down-up": [3, 2, 1, 0, 1, 2],
        "up-down-repeat": [0, 1, 2, 3, 3, 2, 1, 0],
        "down-up-repeat": [3, 2, 1, 0, 0, 1, 2, 3],
        converge: [0, 3, 1, 2],
        diverge: [2, 1, 3, 0],
        "converge-diverge": [0, 3, 1, 2, 1, 3],
        "thumb-up": [0, 1, 0, 2, 0, 3],
        "thumb-up-down": [0, 1, 0, 2, 0, 3, 0, 2],
        "pinky-up": [0, 3, 1, 3, 2, 3],
        "pinky-up-down": [0, 3, 1, 3, 2, 3, 1, 3],
      });
    });

    test("over 5 notes", () => {
      expect(arpeggio("converge", 5)).toEqual([0, 4, 1, 3, 2]);
      expect(arpeggio("diverge", 5)).toEqual([2, 3, 1, 4, 0]);
      expect(arpeggio("converge-diverge", 5)).toEqual([0, 4, 1, 3, 2, 3, 1, 4]);
    });

    test("lengths and ranges for 3 to 8 notes", () => {
      const lengths: Record<string, (n: number) => number> = {
        up: (n) => n,
        down: (n) => n,
        "up-down": (n) => 2 * n - 2,
        "down-up": (n) => 2 * n - 2,
        "up-down-repeat": (n) => 2 * n,
        "down-up-repeat": (n) => 2 * n,
        converge: (n) => n,
        diverge: (n) => n,
        "converge-diverge": (n) => 2 * n - 2,
        "thumb-up": (n) => 2 * n - 2,
        "thumb-up-down": (n) => 4 * n - 8,
        "pinky-up": (n) => 2 * n - 2,
        "pinky-up-down": (n) => 4 * n - 8,
      };
      expect(Object.keys(lengths)).toEqual(arpeggios());
      for (let n = 3; n <= 8; n++) {
        for (const name of arpeggios()) {
          const order = arpeggio(name, n);
          expect(order.length, `${name} ${n}`).toBe(lengths[name](n));
          expect(order.every((i) => i >= 0 && i < n)).toBe(true);
          // every note is played
          expect(new Set(order).size, `${name} ${n}`).toBe(n);
        }
        const up = arpeggio("up", n);
        expect([...up].reverse()).toEqual(arpeggio("down", n));
        expect([...arpeggio("converge", n)].reverse()).toEqual(
          arpeggio("diverge", n),
        );
        // down-up-repeat is up-down-repeat from its second half
        const repeat = arpeggio("up-down-repeat", n);
        expect([...repeat.slice(n), ...repeat.slice(0, n)]).toEqual(
          arpeggio("down-up-repeat", n),
        );
      }
    });

    test("0, 1 and 2 notes", () => {
      for (const name of arpeggios()) {
        expect(arpeggio(name, 0)).toEqual([]);
        expect(arpeggio(name, 1)).toEqual([0]);
      }
      expect(arpeggio("up-down", 2)).toEqual([0, 1]);
      expect(arpeggio("down-up", 2)).toEqual([1, 0]);
      expect(arpeggio("up-down-repeat", 2)).toEqual([0, 1, 1, 0]);
      expect(arpeggio("converge", 2)).toEqual([0, 1]);
      expect(arpeggio("diverge", 2)).toEqual([1, 0]);
      expect(arpeggio("converge-diverge", 2)).toEqual([0, 1]);
      expect(arpeggio("thumb-up", 2)).toEqual([0, 1]);
      expect(arpeggio("thumb-up-down", 2)).toEqual([0, 1]);
      expect(arpeggio("pinky-up", 2)).toEqual([0, 1]);
      expect(arpeggio("pinky-up-down", 2)).toEqual([0, 1]);
    });

    test("invalid", () => {
      expect(arpeggio("sideways", 3)).toEqual([]);
      expect(arpeggio("toString", 3)).toEqual([]);
      expect(arpeggio("up", -1)).toEqual([]);
      expect(arpeggio("up", 2.5)).toEqual([]);
      expect(arpeggio("up", NaN)).toEqual([]);
    });

    test("realised over a chord", () => {
      const cmaj7 = chordSteps(["C4", "maj7"]);
      expect(arpeggio("up-down", 4).map(cmaj7)).toEqual([
        "C4",
        "E4",
        "G4",
        "B4",
        "G4",
        "E4",
      ]);
    });
  });

  describe("sequence", () => {
    test("cells moved by a step", () => {
      expect(sequence([0, 1, 2, 3], 1, 3)).toEqual([
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
      ]);
      expect(sequence([0, 2], 1, 4)).toEqual([
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
      ]);
      expect(sequence([3, 2, 1, 0], -1, 3)).toEqual([
        [3, 2, 1, 0],
        [2, 1, 0, -1],
        [1, 0, -1, -2],
      ]);
      expect(sequence([0, 1], 0, 2)).toEqual([
        [0, 1],
        [0, 1],
      ]);
      expect(sequence([0, 1], 1, 0)).toEqual([]);
    });

    test("invalid", () => {
      expect(sequence([], 1, 3)).toEqual([]);
      expect(sequence([0, 0.5], 1, 3)).toEqual([]);
      expect(sequence([0, 1], 1.5, 3)).toEqual([]);
      expect(sequence([0, 1], 1, -1)).toEqual([]);
    });

    test("book patterns over scales", () => {
      const realise = (groups: number[][], scale: string) =>
        groups.map((g) => g.map(scaleSteps(scale)).join(" "));
      // groups of four through a pentatonic
      expect(
        realise(sequence([0, 1, 2, 3], 1, 5), "C4 major pentatonic"),
      ).toEqual([
        "C4 D4 E4 G4",
        "D4 E4 G4 A4",
        "E4 G4 A4 C5",
        "G4 A4 C5 D5",
        "A4 C5 D5 E5",
      ]);
      // thirds, alternately up and down
      expect(realise(alternate(sequence([0, 2], 1, 4)), "C4 major")).toEqual([
        "C4 E4",
        "F4 D4",
        "E4 G4",
        "A4 F4",
      ]);
      // triads on each degree
      expect(realise(sequence([0, 2, 4], 1, 3), "C4 major")).toEqual([
        "C4 E4 G4",
        "D4 F4 A4",
        "E4 G4 B4",
      ]);
      // 1-2-3-5 is a different cell over different scales
      expect(realise([[0, 1, 2, 4]], "D4 major")).toEqual(["D4 E4 F#4 A4"]);
      expect(realise([[0, 1, 2, 3]], "D4 major pentatonic")).toEqual([
        "D4 E4 F#4 A4",
      ]);
      // groups of four down from the top
      expect(realise(sequence([7, 6, 5, 4], -1, 2), "C4 major")).toEqual([
        "C5 B4 A4 G4",
        "B4 A4 G4 F4",
      ]);
    });

    test("octave recipes", () => {
      // expand first: an order over 2 octaves of a triad
      expect(arpeggio("up-down", 3 * 2)).toEqual([
        0, 1, 2, 3, 4, 5, 4, 3, 2, 1,
      ]);
      expect(arpeggio("converge", 3 * 2)).toEqual([0, 5, 1, 4, 2, 3]);
      expect(arpeggio("thumb-up", 3 * 2)).toEqual([
        0, 1, 0, 2, 0, 3, 0, 4, 0, 5,
      ]);
      // order per octave: the triad order, moved up an octave
      const perOctave = (name: string) =>
        sequence(arpeggio(name, 3), 3, 2).flat();
      expect(perOctave("up")).toEqual([0, 1, 2, 3, 4, 5]);
      expect(perOctave("up-down")).toEqual([0, 1, 2, 1, 3, 4, 5, 4]);
      expect(perOctave("converge")).toEqual([0, 2, 1, 3, 5, 4]);
      expect(perOctave("thumb-up")).toEqual([0, 1, 0, 2, 3, 4, 3, 5]);
      expect(perOctave("up-down").map(chordSteps(["C4", "M"]))).toEqual([
        "C4",
        "E4",
        "G4",
        "E4",
        "C5",
        "E5",
        "G5",
        "E5",
      ]);
    });
  });

  describe("alternate", () => {
    test("reverses every other group", () => {
      expect(
        alternate([
          [0, 2],
          [1, 3],
          [2, 4],
          [3, 5],
        ]),
      ).toEqual([
        [0, 2],
        [3, 1],
        [2, 4],
        [5, 3],
      ]);
      expect(alternate([])).toEqual([]);
    });

    test("doesn't change its input", () => {
      const groups = [
        [0, 1],
        [1, 2],
      ];
      const result = alternate(groups);
      expect(groups).toEqual([
        [0, 1],
        [1, 2],
      ]);
      expect(result[0]).not.toBe(groups[0]);
    });

    test("invalid", () => {
      expect(alternate([0, 1] as never)).toEqual([]);
      expect(alternate([[0, 0.5]])).toEqual([]);
    });
  });

  describe("repeat", () => {
    test("repeats each index", () => {
      expect(repeat([0, 1, 2], 2)).toEqual([0, 0, 1, 1, 2, 2]);
      expect(repeat(arpeggio("down", 3), 2)).toEqual([2, 2, 1, 1, 0, 0]);
      expect(repeat([0, 1], 1)).toEqual([0, 1]);
      expect(repeat([0, 1], 0)).toEqual([]);
    });

    test("invalid", () => {
      expect(repeat([0, 1], -1)).toEqual([]);
      expect(repeat([0, 1], 1.5)).toEqual([]);
      expect(repeat(["a"] as never, 2)).toEqual([]);
    });
  });
});
