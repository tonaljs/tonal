import { all as allChordTypes, get as getChordType } from "@tonaljs/chord-type";
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
      $("DmMaj7 DmM7 DmΔ Dm/ma7 Dm/ma7 Dm/ma7"),
    );
    expect(inC($("ii69 ii6/9 ii6add9 iiM69"))).toEqual(
      $("Dm69 Dm69 Dm69 Dm69"),
    );
    expect(inC($("iiadd9 iiMadd9 iiadd2 ii2"))).toEqual(
      $("Dmadd9 Dmadd9 Dmadd9 Dmadd9"),
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

  test("every spelling of each chord type gives the same chord", () => {
    const failed: string[] = [];
    for (const type of allChordTypes()) {
      const chords = type.aliases
        .map((alias) => Progression.fromRomanNumerals("C", ["ii" + alias])[0])
        // some chord types can't be written as roman numerals yet ("iidim")
        .filter((chord) => chord !== "");
      const intervals = new Set(
        chords.map((chord) => getChordType(chord.slice(1)).intervals.join(" ")),
      );
      if (intervals.size > 1) failed.push(chords.join(" "));
    }
    expect(failed).toEqual([]);
  });

  test("abstract", () => {
    const roman = Progression.toRomanNumerals("C", ["Cmaj7", "Dm7", "G7"]);
    expect(roman).toEqual(["Imaj7", "IIm7", "V7"]);
  });
});
