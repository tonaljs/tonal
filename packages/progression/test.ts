import { all as allChordTypes, get as getChordType } from "@tonaljs/chord-type";
import { majorKey } from "@tonaljs/key";
import { describe, expect, test } from "vitest";
import Progression from "./index";

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
    // the minor form of 7b5 is half-diminished, not minor
    expect(inC($("ii7b5 ii7b9 ii13#11"))).toEqual($("D7b5 D7b9 D13#11"));
    // the 11 chord has no third, so it falls back to its minor name
    expect(inC($("ii11"))).toEqual($("Dm11"));
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
