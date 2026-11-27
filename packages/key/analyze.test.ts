import { get as chord } from "@tonaljs/chord";
import { fromRomanNumerals } from "@tonaljs/progression";
import { describe, expect, test } from "vitest";
import { analyzeChord, majorKey, minorKey } from "./index";

// "numeral source function [scale] [-> target resolution]" for each reading
const readings = (
  key: string,
  name: string,
  next?: string,
  previous?: string,
) =>
  analyzeChord(key, name, { next, previous }).map((r) =>
    [
      r.numeral,
      r.source,
      r.function,
      r.scale && `(${r.scale})`,
      r.target && `-> ${r.target}`,
      r.resolution,
    ]
      .filter(Boolean)
      .join(" "),
  );

describe("Key.analyzeChord", () => {
  test("diatonic chords", () => {
    expect(analyzeChord("C major", "Cmaj7")).toEqual([
      {
        chord: "Cmaj7",
        numeral: "Imaj7",
        degree: "Imaj7",
        source: "diatonic",
        function: "T",
        scale: "C major",
        target: "",
        resolution: "",
        chordScale: "C major",
      },
    ]);
    expect(readings("C major", "Dm9")).toEqual(["ii9 diatonic SD (C major)"]);
    expect(readings("C major", "Bdim")).toEqual(["viio diatonic D (C major)"]);
    expect(readings("C major", "G7")).toEqual(["V7 diatonic D (C major)"]);
    expect(readings("C", "Dm7")).toEqual(["ii7 diatonic SD (C major)"]);
  });

  test("vi before V is subdominant", () => {
    expect(readings("C major", "Am7", "G7")).toEqual([
      "vi7 diatonic SD (C major)",
    ]);
    expect(readings("C major", "Am7", "Dm7")).toEqual([
      "vi7 diatonic T (C major)",
    ]);
  });

  test("minor keys: natural, harmonic and melodic forms", () => {
    expect(readings("A minor", "Am7")).toEqual(["i7 diatonic T (A minor)"]);
    expect(readings("A minor", "Bm7b5")).toEqual([
      "ii7b5 diatonic SD (A minor)",
    ]);
    expect(readings("A minor", "E7")).toEqual([
      "V7 diatonic D (A harmonic minor)",
    ]);
    expect(readings("A minor", "G#o7")).toEqual([
      "viio7 diatonic D (A harmonic minor)",
    ]);
    expect(readings("A minor", "AmMaj7")).toEqual([
      "iMaj7 diatonic T (A harmonic minor)",
    ]);
    expect(readings("A minor", "D7")).toEqual([
      "IV7 diatonic SD (A melodic minor)",
    ]);
  });

  test("secondary dominants", () => {
    expect(analyzeChord("C major", "A7", { next: "Dm7" })).toEqual([
      {
        chord: "A7",
        numeral: "V7/ii",
        degree: "VI7",
        source: "secondary dominant",
        function: "D",
        scale: "",
        target: "ii",
        resolution: "functioning",
        chordScale: "A mixolydian b6",
      },
    ]);
    expect(readings("C major", "A7", "D7")).toEqual([
      "V7/ii secondary dominant D -> ii functioning",
    ]);
    expect(readings("C major", "A7", "G7")).toEqual([
      "V7/ii secondary dominant D -> ii non-functioning",
    ]);
    expect(readings("C major", "A7b9")).toEqual([
      "V7b9/ii secondary dominant D -> ii",
    ]);
    expect(readings("C major", "E")).toEqual([
      "V/vi secondary dominant D -> vi",
    ]);
    expect(readings("C major", "C7")).toEqual([
      "V7/IV secondary dominant D -> IV",
    ]);
    expect(readings("A minor", "B7", "E7")).toEqual([
      "V7/V secondary dominant D -> V functioning",
    ]);
    expect(readings("A minor", "A7", "Dm7")).toEqual([
      "V7/iv secondary dominant D -> iv functioning",
    ]);
  });

  test("after its related ii, a secondary dominant ranks first", () => {
    expect(readings("C major", "D7", undefined, "Am7")).toEqual([
      "V7/V secondary dominant D -> V",
    ]);
  });

  test("tritone substitutes", () => {
    expect(readings("C major", "Db7", "C")).toEqual([
      "subV7/I tritone substitute D -> I functioning",
    ]);
    expect(readings("C major", "Eb7", "Dm7")).toEqual([
      "subV7/ii tritone substitute D -> ii functioning",
    ]);
    expect(analyzeChord("C major", "Db7")[0].chordScale).toBe(
      "Db lydian dominant",
    );
    expect(readings("A minor", "F7", "E7")).toEqual([
      "subV7/V tritone substitute D -> V functioning",
    ]);
  });

  test("related ii", () => {
    expect(readings("C major", "Am7", "D7")).toEqual([
      "ii7/V related ii SD -> V functioning",
      "vi7 diatonic T (C major)",
    ]);
    expect(readings("C major", "Em7b5", "A7")).toEqual([
      "ii7b5/ii related ii SD -> ii functioning",
    ]);
    expect(analyzeChord("C major", "Am7", { next: "D7" })[0].chordScale).toBe(
      "A dorian",
    );
    // before the key's own V the ii is diatonic (or borrowed)
    expect(readings("C major", "Dm7", "G7")).toEqual([
      "ii7 diatonic SD (C major)",
    ]);
    expect(readings("C major", "Dm7b5", "G7")).toEqual([
      "ii7b5 borrowed SD (C minor)",
    ]);
  });

  test("borrowed chords", () => {
    expect(readings("C major", "Fm7")).toEqual(["iv7 borrowed SD (C minor)"]);
    expect(readings("C major", "Abmaj7")).toEqual([
      "bVImaj7 borrowed SD (C minor)",
    ]);
    expect(readings("C major", "F7")).toEqual([
      "IV7 borrowed SD (C melodic minor)",
      "subV7/iii tritone substitute D -> iii",
    ]);
    // from a mode only when nothing else reads the chord
    expect(readings("C major", "Bbmaj7")).toEqual([
      "bVIImaj7 borrowed (C mixolydian)",
    ]);
    expect(readings("A minor", "Amaj7")).toEqual([
      "Imaj7 borrowed T (A major)",
    ]);
  });

  test("backdoor dominant: the same chord, three readings", () => {
    expect(readings("C major", "Bb7", "C")).toEqual([
      "bVII7 backdoor D -> I functioning",
      "bVII7 borrowed SD (C minor)",
      "subV7/vi tritone substitute D -> vi non-functioning",
    ]);
    expect(readings("C major", "Bb7")).toEqual([
      "bVII7 borrowed SD (C minor)",
      "subV7/vi tritone substitute D -> vi",
    ]);
  });

  test("diminished chords", () => {
    expect(readings("C major", "C#o7", "Dm7")).toEqual([
      "viio7/ii passing diminished D -> ii functioning",
    ]);
    expect(readings("C major", "Dbo7", "Dm7")).toEqual([
      "viio7/ii passing diminished D -> ii functioning",
    ]);
    expect(readings("C major", "F#o7", "G7")).toEqual([
      "viio7/V passing diminished D -> V functioning",
    ]);
    // down between two chords a whole step apart
    expect(readings("C major", "Ebo7", "Dm7", "Em7")).toEqual([
      "biiio7 passing diminished -> ii functioning",
    ]);
    expect(readings("C major", "Co7", "C")).toEqual([
      "io7 common-tone diminished -> I functioning",
    ]);
    expect(readings("C major", "Co7", "Dm7", "C")).toEqual([
      "io7 common-tone diminished -> I non-functioning",
    ]);
    expect(readings("C major", "Co7")).toEqual(["io7 chromatic"]);
  });

  test("chromatic chords", () => {
    expect(readings("C major", "F#maj7")).toEqual(["#IVmaj7 chromatic"]);
    expect(analyzeChord("C major", "F#maj7")[0].chordScale).toBe("F# major");
  });

  test("slash chords read like their chord", () => {
    expect(analyzeChord("C major", "C/E")).toEqual([
      expect.objectContaining({
        chord: "C/E",
        numeral: "I",
        source: "diatonic",
      }),
    ]);
  });

  test("invalid input", () => {
    expect(analyzeChord("C dorian", "C")).toEqual([]);
    expect(analyzeChord("X", "C")).toEqual([]);
    expect(analyzeChord("C major", "Xyz")).toEqual([]);
    expect(analyzeChord("C major", "")).toEqual([]);
    // @ts-expect-error invalid input
    expect(analyzeChord(undefined, "C")).toEqual([]);
    // an invalid neighbour is ignored
    expect(readings("C major", "A7", "Xyz")).toEqual([
      "V7/ii secondary dominant D -> ii",
    ]);
  });

  const TONICS = "C G D A E B F# Db Ab Eb Bb F".split(" ");

  test("every diatonic chord of 12 major and minor keys reads as diatonic", () => {
    for (const tonic of TONICS) {
      const major = majorKey(tonic);
      const minor = minorKey(tonic);
      const forms = [
        [`${tonic} major`, `${tonic} major`, major],
        [`${tonic} minor`, `${tonic} minor`, minor.natural],
        [`${tonic} minor`, `${tonic} harmonic minor`, minor.harmonic],
        [`${tonic} minor`, `${tonic} melodic minor`, minor.melodic],
      ] as const;
      for (const [key, scale, form] of forms) {
        [...form.chords, ...form.triads].forEach((name, i) => {
          const [first] = analyzeChord(key, name);
          expect(first.source, `${name} in ${key}`).toBe("diatonic");
          // a chord in an earlier minor form takes that form
          if (first.scale !== scale) return;
          expect(first.function).toBe(form.chordsHarmonicFunction[i % 7]);
          if (i < 7) expect(first.chordScale).toBe(form.chordScales[i]);
        });
      }
    }
  });

  test("numerals give the chord back (except subV)", () => {
    const cases: [string, string, string?, string?][] = [
      ["C major", "Dm7b5", "G7"],
      ["C major", "Em7b5", "A7"],
      ["C major", "Am7", "D7"],
      ["C major", "A7b9", "Dm7"],
      ["C major", "C#o7", "Dm7"],
      ["C major", "Bb7", "C"],
      ["C major", "Bbmaj7"],
      ["C major", "Co7", "C"],
      ["C major", "Ebo7", "Dm7", "Em7"],
      ["A minor", "B7", "E7"],
      ["A minor", "G#o7"],
      ["A minor", "AmMaj7"],
      ["Eb major", "Gm7", "C7"],
      ["F# minor", "C#7", "F#m"],
    ];
    for (const tonic of TONICS) {
      for (const name of [
        ...majorKey(tonic).chords,
        ...minorKey(tonic).harmonic.chords,
      ]) {
        cases.push([`${tonic} major`, name], [`${tonic} minor`, name]);
      }
    }
    const pcs = (name: string) => chord(name).chroma;
    for (const [key, name, next, previous] of cases) {
      const tonic = key.split(" ")[0];
      for (const r of analyzeChord(key, name, { next, previous })) {
        if (r.numeral.startsWith("subV")) continue;
        const [back] = fromRomanNumerals(tonic, [r.numeral]);
        expect(pcs(back), `${r.numeral} (${name} in ${key})`).toBe(pcs(name));
        const [plain] = fromRomanNumerals(tonic, [r.degree]);
        expect(pcs(plain), `${r.degree} (${name} in ${key})`).toBe(pcs(name));
      }
    }
  });
});
