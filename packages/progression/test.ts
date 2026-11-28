import { get as getChord } from "@tonaljs/chord";
import { all as allChordTypes, get as getChordType } from "@tonaljs/chord-type";
import { majorKey } from "@tonaljs/key";
import { describe, expect, test } from "vitest";
import Progression, { find, fromPattern, patterns } from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/progression", () => {
  test("concrete", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("I IIm7 V7"))).toEqual($("C Dm7 G7"));
    expect(inC($("Imaj7 2 IIIm7"))).toEqual(["Cmaj7", "", "Em7"]);
    expect(inC($("I II III IV V VI VII"))).toEqual($("C D E F G A B"));
    expect(inC($("bI bII bIII bIV bV bVI bVII"))).toEqual(
      $("Cb Db Eb Fb Gb Ab Bb"),
    );
    expect(inC($("#Im7 #IIm7 #III #IVMaj7 #V7 #VI #VIIo"))).toEqual(
      $("C#m7 D#m7 E# F#Maj7 G#7 A# B#o"),
    );
  });

  test("lowercase numerals are minor chords", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("i ii iii iv v vi vii"))).toEqual($("Cm Dm Em Fm Gm Am Bm"));
    expect(inC($("ii7 iii9 vi6 iiadd9 iMaj7"))).toEqual(
      $("Dm7 Em9 Am6 Dmadd9 CmMaj7"),
    );
    expect(inC($("bvi #iv7"))).toEqual($("Abm F#m7"));
    expect(Progression.fromRomanNumerals("A", $("i iv v"))).toEqual(
      $("Am Dm Em"),
    );
  });

  test("lowercase numerals keep a chord type with its own quality", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("iim7 viio viio7 viim7b5 viiø iim"))).toEqual(
      $("Dm7 Bo Bo7 Bm7b5 Bø Dm"),
    );
    expect(inC($("iisus4 ii+"))).toEqual($("Dsus4 D+"));
  });

  test("lowercase numerals give the same chord for every spelling", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("iiMaj7 iiM7 iiΔ iimaj7 iima7 ii^7"))).toEqual(
      $("DmMaj7 DmM7 DmΔ DmMaj7 DmMaj7 DmMaj7"),
    );
    expect(inC($("ii69 ii6/9 ii6add9 iiM69"))).toEqual(
      $("Dm69 Dm69 Dm69 Dm69"),
    );
    expect(inC($("iiadd9 iiMadd9 iiadd2 ii2"))).toEqual(
      $("Dmadd9 Dmadd9 Dmadd2 Dmadd9"),
    );
    expect(inC($("iimaj9 iiΔ9 ii^9"))).toEqual($("DmM9 DmM9 DmM9"));
    expect(inC($("ii6 iiM6 iiadd6"))).toEqual($("Dm6 Dm6 Dm6"));
  });

  test("lowercase numerals keep augmented chord types", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("ii+ iiaug ii7#5 ii+7 ii9#5 ii9+"))).toEqual(
      $("D+ Daug D7#5 D+7 D9#5 D9+"),
    );
  });

  test("lowercase numerals keep chord types without a minor form", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    // a minor third would be the same note as the #9
    expect(inC($("ii7#9 ii7(#9) ii7b5#9 ii7alt"))).toEqual(
      $("D7#9 D7(#9) D7b5#9 D7alt"),
    );
    // no third to make minor
    expect(inC($("ii5 ii7sus4 ii(no3) ii7(no3)"))).toEqual(
      $("D5 D7sus4 D(no3) D7(no3)"),
    );
    // the 11 chord has no third, so it falls back to its minor name
    expect(inC($("ii11"))).toEqual($("Dm11"));
  });

  test("lowercase numerals with a flat fifth are diminished", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("ii7b5 ii7(b5) iiMb5 ii9b5 ii7b5b13"))).toEqual(
      $("Dm7b5 Dm7(b5) Ddim Dm9b5 Dm7b5b13"),
    );
  });

  test("lowercase numerals with alterations are minor", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("ii7b9 ii13#11 ii9#11 iiM7b9 ii11b9"))).toEqual(
      $("Dm7b9 Dm13#11 Dm9#11 DmM7b9 Dm11b9"),
    );
    expect(inC($("ii7(b9) ii11(b9) ii(b9) ii13(b9) iimaj7(#11)"))).toEqual(
      $("Dm7(b9) Dm11(b9) Dm(b9) Dm13(b9) Dmmaj7(#11)"),
    );
    // a b5 lowers the fifth and a #11 keeps it
    expect(inC($("ii6b5 ii6#11 ii7b5b9 ii7b9#11"))).toEqual(
      $("Dm6b5 Dm6#11 Dm7b5b9 Dm7b9#11"),
    );
    // a listed and a composed spelling of the same chord give the same chord
    const intervals = (chord: string) => getChord(chord).intervals.join(" ");
    expect(inC($("ii7b9 ii7(b9)")).map(intervals)).toEqual([
      "1P 3m 5P 7m 9m",
      "1P 3m 5P 7m 9m",
    ]);
  });

  test("composed chord types", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("V7(b9) Imaj7(no3) IV(add9) V7(b9,#11) bVII7(#11)"))).toEqual(
      $("G7(b9) Cmaj7(no3) F(add9) G7(b9,#11) Bb7(#11)"),
    );
    expect(inC($("V7(b9)/V I(add9)/E ii(add9)"))).toEqual(
      $("D7(b9) C(add9)/E Dm(add9)"),
    );
  });

  test("no chord isn't a chord type", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("INC IN.C. Vnc iNC VNC/E"))).toEqual(["", "", "", "", ""]);
  });

  test("toRomanNumerals with composed chord types reads back", () => {
    const chords = $("G7(b9) Cmaj7(no3) F(add9) Dm7(b5) A7(b9,#11)");
    const romans = Progression.toRomanNumerals("C", chords);
    expect(romans).toEqual(
      $("V7(b9) Imaj7(no3) IV(add9) IIm7(b5) VI7(b9,#11)"),
    );
    expect(Progression.fromRomanNumerals("C", romans)).toEqual(chords);
  });

  test("every spelling of each chord type gives the same chord", () => {
    const failed: string[] = [];
    for (const type of allChordTypes()) {
      const chords = type.aliases.map(
        (alias) => Progression.fromRomanNumerals("C", ["ii" + alias])[0],
      );
      if (chords.includes("")) failed.push(type.aliases.join(" "));
      const intervals = new Set(
        chords.map((chord) => getChordType(chord.slice(1)).intervals.join(" ")),
      );
      if (intervals.size > 1) failed.push(chords.join(" "));
    }
    expect(failed).toEqual([]);
  });

  test("applied chords", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("V7/V V/ii V7/iii V7/IV V7/vi"))).toEqual($("D7 A B7 C7 E7"));
    expect(inC($("viio7/V vii/V ii/V IV/IV V/bVI"))).toEqual(
      $("F#o7 F#m Am Bb Eb"),
    );
    // nested
    expect(inC($("V/V/V V7/V/ii"))).toEqual($("A E7"));
    expect(Progression.fromRomanNumerals("Eb", $("I V7/ii ii V7 I"))).toEqual(
      $("Eb C7 Fm Bb7 Eb"),
    );
  });

  test("applied dominants are the key's secondary dominants", () => {
    const tonics = $("C G D A E B F# C# F Bb Eb Ab Db Gb Cb");
    for (const tonic of tonics) {
      const applied = Progression.fromRomanNumerals(
        tonic,
        $("V7/I V7/ii V7/iii V7/IV V7/V V7/vi V7/vii"),
      );
      const expected = majorKey(tonic).secondaryDominants;
      // the key leaves out the dominant of I (it's V7) and of viio
      expect(applied.slice(1, 6)).toEqual(expected.slice(1, 6));
    }
  });

  test("unknown chord types give an empty chord", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("V65 It6 N6 Cad64 VIIb5 bIIImaj4 I/b3 V7/"))).toEqual([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    // the leadsheet meaning of I6 is kept: it's an added-sixth chord
    expect(inC($("I6"))).toEqual($("C6"));
    expect(Progression.fromRomanNumerals("", $("V7"))).toEqual([""]);
  });

  test("a bass note after a slash", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("I/E V7/B i/Eb vi7/G"))).toEqual($("C/E G7/B Cm/Eb Am7/G"));
  });

  test("chord types with an i or a v", () => {
    const inC = (chords: string[]) =>
      Progression.fromRomanNumerals("C", chords);
    expect(inC($("viidim7 VIIdim iimin7 Imi7 IVdim viidim7/V Idim/E"))).toEqual(
      $("Bdim7 Bdim Dmin7 Cmi7 Fdim F#dim7 Cdim/E"),
    );
  });

  test("abstract", () => {
    const roman = Progression.toRomanNumerals("C", ["Cmaj7", "Dm7", "G7"]);
    expect(roman).toEqual(["Imaj7", "IIm7", "V7"]);
  });

  test("toRomanNumerals and back", () => {
    const chords = $("Bdim7 Bdim Cmin7 Dmi7 Fdim C#dim7 Cmaj7 Bm7b5 G7");
    const roman = Progression.toRomanNumerals("C", chords);
    expect(roman).toEqual(
      $("VIIdim7 VIIdim Imin7 IImi7 IVdim #Idim7 Imaj7 VIIm7b5 V7"),
    );
    expect(Progression.fromRomanNumerals("C", roman)).toEqual(chords);
  });
});

describe("named progressions", () => {
  test("every pattern finds itself in any key", () => {
    for (const pattern of patterns()) {
      for (const tonic of ["C", "F#", "Eb", "Bb"]) {
        const chords = fromPattern(pattern.name, tonic);
        expect(chords.every((c) => c !== "")).toBe(true);
        const found = find(chords, pattern.name);
        expect([pattern.name, tonic, found[0]]).toEqual([
          pattern.name,
          tonic,
          { name: pattern.name, start: 0, length: chords.length, tonic },
        ]);
      }
    }
  });

  test("names and aliases are unique", () => {
    const names = patterns().flatMap((p) => [p.name, ...p.aliases]);
    expect(new Set(names).size).toBe(names.length);
  });

  test("by name, alias or numerals", () => {
    const chords = $("Em7 A7 Dm7 G7 Cmaj7");
    expect(find(chords, "ii–V–I")).toEqual([
      { name: "ii–V–I", start: 2, length: 3, tonic: "C" },
    ]);
    // dashes and case don't matter for names
    expect(find(chords, "ii-V-I")).toEqual(find(chords, "ii–V–I"));
    expect(find(chords, "Long Cadence")[0].name).toBe("iii–VI7–ii–V–I");
    // but the case of numerals does
    expect(find($("Fm7 Cmaj7"), "iv–I")).toHaveLength(1);
    expect(find($("Fm7 Cmaj7"), "IV–I")).toEqual([]);
    expect(find(chords, "IIm7 V7 Imaj7")).toEqual([
      { name: "", start: 2, length: 3, tonic: "C" },
    ]);
    expect(find(chords, ["IIm7|IIm7b5", "V7"])).toHaveLength(2);
  });

  test("a chord fits a numeral by its family", () => {
    expect(find($("Dm9 G13 C6"), "ii–V–I")[0].tonic).toBe("C");
    expect(find($("Bm7b5 E7b9 Am6"), "ii–V–I")[0].tonic).toBe("A");
    expect(find($("Dm7 G7sus4 Cmaj7"), "ii–V–I")).toHaveLength(1);
    expect(find($("Dm7 G Cmaj7"), "ii–V–I")).toEqual([]);
  });

  test("a chord repeated right after itself is held", () => {
    expect(find($("Fm7 Bb7 Ebmaj7 Ebmaj7"), "IIm7 V7 Imaj7")).toEqual([
      { name: "", start: 0, length: 4, tonic: "Eb" },
    ]);
    expect(find($("Dm7 Dm9 G7 C"), "ii–V–I")[0]).toEqual({
      name: "ii–V–I",
      start: 0,
      length: 4,
      tonic: "C",
    });
  });

  test("overlapping matches, in order", () => {
    const chords = $("Dm7 G7 Cmaj7 Em7 A7 Dm7 G7 Cmaj7");
    expect(find(chords, "ii–V").map((m) => [m.start, m.tonic])).toEqual([
      [0, "C"],
      [3, "D"],
      [5, "C"],
    ]);
  });

  test("a match doesn't end on a minor tonic that is a ii", () => {
    // Dm7 is followed by its dominant: not a ii–V–i in D minor
    const chords = $("Em7 A7 Dm7 G7 Cmaj7");
    expect(find(chords, "ii–V–I").map((m) => m.tonic)).toEqual(["C"]);
    // by name or by numerals, the same rule
    expect(find(chords, "IIm7 V7 Im7")).toEqual([]);
    expect(find(chords, "V7 Im7|Imaj7").map((m) => m.tonic)).toEqual(["C"]);
    // a minor chord that isn't on the I is matched (VI7–ii)
    expect(find(chords, "VI7 IIm7").map((m) => m.tonic)).toEqual(["C"]);
    // a minor tonic not followed by its dominant is one
    expect(find($("Em7 A7 Dm7 Bb7"), "ii–V–I").map((m) => m.tonic)).toEqual([
      "D",
    ]);
    // literal: as written
    expect(
      find(chords, "IIm7 V7 Im7", { literal: true }).map((m) => m.tonic),
    ).toEqual(["D"]);
    expect(
      find(chords, "ii–V–I", { literal: true }).map((m) => m.tonic),
    ).toEqual(["D", "C"]);
  });

  test("not a chord, not a pattern", () => {
    expect(find($("Dm7 N.C. G7 C"), "ii–V–I")).toEqual([]);
    expect(find($("C G7"), "nothing")).toEqual([]);
    expect(find($("C G7"), "IIm7 Xyz")).toEqual([]);
    expect(find("C G7" as unknown as string[], "ii–V")).toEqual([]);
    expect(fromPattern("nothing", "C")).toEqual([]);
    expect(fromPattern("ii–V–I", "H")).toEqual([]);
  });

  test("fromPattern", () => {
    expect(fromPattern("ii–V–I", "F")).toEqual(["Gm7", "C7", "Fmaj7"]);
    expect(fromPattern("andalusian cadence", "A")).toEqual([
      "Am",
      "G",
      "F",
      "E",
    ]);
    expect(fromPattern("POT", "Eb")).toEqual(["Ebmaj7", "C7", "Fm7", "Bb7"]);
    expect(fromPattern(["IVm7", "bVII7", "Imaj7"], "C")).toEqual([
      "Fm7",
      "Bb7",
      "Cmaj7",
    ]);
  });

  test("patterns() is a copy", () => {
    patterns()[0].aliases.push("changed");
    expect(patterns()[0].aliases).not.toContain("changed");
  });
});
