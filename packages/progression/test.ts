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

  test("abstract", () => {
    const roman = Progression.toRomanNumerals("C", ["Cmaj7", "Dm7", "G7"]);
    expect(roman).toEqual(["Imaj7", "IIm7", "V7"]);
  });
});
