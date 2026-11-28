import { get as getChord } from "@tonaljs/chord";
import { chroma } from "@tonaljs/note";
import { describe, expect, test } from "vitest";
import { pivotChords } from "./index";

const show = (list: ReturnType<typeof pivotChords>) =>
  list.map((p) => `${p.chord}: ${p.from} ${p.to}`);
const id = (name: string) => {
  const c = getChord(name);
  return `${chroma(c.tonic!)}|${c.chroma}`;
};
const TONICS = "C G D A E B F# C# F Bb Eb Ab Db Gb Cb".split(" ");

describe("Key.pivotChords", () => {
  test("keys a fifth apart share four triads", () => {
    expect(show(pivotChords("C major", "G major"))).toEqual([
      "C: I IV",
      "Em: iii vi",
      "G: V I",
      "Am: vi ii",
    ]);
    expect(show(pivotChords("Eb major", "Bb major"))).toEqual([
      "Eb: I IV",
      "Gm: iii vi",
      "Bb: V I",
      "Cm: vi ii",
    ]);
    for (const tonic of TONICS) {
      expect(pivotChords(`${tonic} major`, `${tonic} major`).length).toBe(7);
    }
  });

  test("relative keys share the seven natural minor triads", () => {
    expect(show(pivotChords("C major", "A minor"))).toEqual([
      "C: I bIII",
      "Dm: ii iv",
      "Em: iii v",
      "F: IV bVI",
      "G: V bVII",
      "Am: vi i",
      "Bdim: viio iio",
    ]);
  });

  test("the three minor forms", () => {
    // C minor's melodic ii and IV, harmonic V and vii
    expect(show(pivotChords("C major", "C minor"))).toEqual([
      "Dm: ii ii",
      "F: IV IV",
      "G: V V",
      "Bdim: viio viio",
    ]);
  });

  test("no shared chords", () => {
    expect(pivotChords("C major", "F# major")).toEqual([]);
  });

  test("symmetric, spelled in the destination", () => {
    // sharp and flat keys, major and minor (every pair is slow)
    const keys = ["C", "G", "E", "F#", "F", "Bb", "Db"].flatMap((t) => [
      `${t} major`,
      `${t} minor`,
    ]);
    const own = new Map(
      keys.map((k) => [k, pivotChords(k, k).map((q) => q.chord)]),
    );
    for (const a of keys) {
      for (const b of keys) {
        const ab = pivotChords(a, b);
        const ba = pivotChords(b, a);
        const pairs = (list: typeof ab, swap: boolean) =>
          list
            .map(
              (p) =>
                `${id(p.chord)} ${swap ? p.to : p.from} ${swap ? p.from : p.to}`,
            )
            .sort();
        expect(pairs(ab, false)).toEqual(pairs(ba, true));
        // spelled as in the destination: its notes are notes of b's chords
        for (const p of ab) {
          expect(own.get(b)).toContain(p.chord);
        }
      }
    }
  });

  test("sevenths", () => {
    expect(show(pivotChords("C major", "G major", { sevenths: true }))).toEqual(
      ["Cmaj7: Imaj7 IVmaj7", "Em7: iii7 vi7", "Am7: vi7 ii7"],
    );
  });

  test("chromatic", () => {
    const list = pivotChords("C major", "G major", { chromatic: true });
    expect(show(list)).toEqual([
      "C: I IV",
      "Em: iii vi",
      "G: V I",
      "Am: vi ii",
      "Dm: ii v",
      "F: IV bVII",
      "D: V/V V",
    ]);
    expect(list[6]).toEqual({
      chord: "D",
      from: "V/V",
      to: "V",
      fromSource: "secondary dominant",
      toSource: "diatonic",
    });
    expect(
      show(
        pivotChords("C major", "G major", { sevenths: true, chromatic: true }),
      ),
    ).toContain("D7: V7/V V7");
    // borrowed from a mode doesn't count: Gmaj7 isn't a pivot from C
    expect(
      show(
        pivotChords("C major", "G major", { sevenths: true, chromatic: true }),
      ),
    ).not.toContain("Gmaj7: Vmaj7 Imaj7");
  });

  test("invalid", () => {
    expect(pivotChords("nonsense", "C major")).toEqual([]);
    expect(pivotChords("C major", "C dorian")).toEqual([]);
    expect(pivotChords("C major", undefined as unknown as string)).toEqual([]);
  });
});
