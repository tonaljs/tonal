import { describe, test, expect } from "vitest";
import * as Tonal from "./index";

describe("tonal", () => {
  test("exported modules and functions", () => {
    const exportedNames = Object.keys(Tonal).sort();
    expect(exportedNames).toMatchSnapshot();
  });
  test("Modules exports functions", () => {
    const modNames = Object.keys(Tonal)
      .sort()
      .filter((name) => name[0] === name.toUpperCase()[0]);

    const exportedFunctions = modNames.reduce(
      (exported, modName) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = (Tonal as any)[modName];
        exported[modName] = Object.keys(mod)
          .filter((x) => x !== "default")
          .sort();
        return exported;
      },
      {} as Record<string, string[]>,
    );

    expect(exportedFunctions).toMatchSnapshot();
  });

  describe("Scale.chords agrees with Key and Mode", () => {
    const { Chord, Key, Mode, Scale } = Tonal;
    const tonics = "CDEFGAB".split("").flatMap((l) => [l + "b", l, l + "#"]);
    const symbols = (scale: string, size = 3) =>
      Scale.chords(scale, { size }).map((c) => c.symbol);
    // the same chord: same notes, whatever the type alias
    const notes = (symbols: readonly string[]) =>
      symbols.map((symbol) => Chord.get(symbol).notes.join(" "));

    test("modes", () => {
      for (const mode of Mode.names()) {
        for (const tonic of tonics) {
          const scale = `${tonic} ${mode}`;
          expect(notes(symbols(scale))).toEqual(
            notes(Mode.triads(mode, tonic)),
          );
          expect(notes(symbols(scale, 4))).toEqual(
            notes(Mode.seventhChords(mode, tonic)),
          );
        }
      }
    });

    test("major and minor keys", () => {
      for (const tonic of tonics) {
        const major = Key.majorKey(tonic);
        expect(symbols(`${tonic} major`)).toEqual(major.triads);
        expect(notes(symbols(`${tonic} major`, 4))).toEqual(
          notes(major.chords),
        );
        const minor = Key.minorKey(tonic);
        const scales = [
          [minor.natural, `${tonic} minor`],
          [minor.harmonic, `${tonic} harmonic minor`],
          [minor.melodic, `${tonic} melodic minor`],
        ] as const;
        for (const [key, scale] of scales) {
          expect(symbols(scale)).toEqual(key.triads);
          const chords = notes(symbols(scale, 4));
          // the melodic minor tonic is mMaj7 here and m6 in Key (jazz practice)
          if (key === minor.melodic) {
            expect(chords[0]).toEqual(notes([tonic + "mMaj7"])[0]);
            expect(key.chords[0]).toEqual(tonic + "m6");
            expect(chords.slice(1)).toEqual(notes(key.chords.slice(1)));
          } else {
            expect(chords).toEqual(notes(key.chords));
          }
        }
      }
    });
  });
});
