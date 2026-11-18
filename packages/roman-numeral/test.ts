import { describe, expect, it, test } from "vitest";
import { interval } from "@tonaljs/core";
import RomanNumeral, { tokenize } from "./index";

const $ = (str: string) => str.split(" ");

describe("tonal-roman-numeral", () => {
  test("names", () => {
    expect(RomanNumeral.names()).toEqual([
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
    ]);
    expect(RomanNumeral.names(false)).toEqual([
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
    ]);
  });

  describe("romanNumeral", () => {
    test("properties", () => {
      expect(RomanNumeral.get("#VIIb5")).toEqual({
        empty: false,
        name: "#VIIb5",
        roman: "VII",
        interval: "7A",
        acc: "#",
        chordType: "b5",
        of: "",
        major: true,
        step: 6,
        alt: 1,
        oct: 0,
        dir: 1,
      });
    });
    test("RomanNumeral is compatible with Pitch", () => {
      const naturals = $("1P 2M 3M 4P 5P 6M 7M").map(interval);
      expect(naturals.map(RomanNumeral.get).map((n) => n.name)).toEqual(
        $("I II III IV V VI VII"),
      );
      const flats = $("1d 2m 3m 4d 5d 6m 7m").map(interval);
      expect(flats.map(RomanNumeral.get).map((n) => n.name)).toEqual(
        $("bI bII bIII bIV bV bVI bVII"),
      );
      const sharps = $("1A 2A 3A 4A 5A 6A 7A").map(interval);
      expect(sharps.map(RomanNumeral.get).map((n) => n.name)).toEqual(
        $("#I #II #III #IV #V #VI #VII"),
      );
    });
    test("Can convert to intervals", () => {
      expect(interval(RomanNumeral.get("I")).name).toEqual("1P");
      expect(interval(RomanNumeral.get("bIIImaj4")).name).toEqual("3m");
      expect(interval(RomanNumeral.get("#IV7")).name).toEqual("4A");
    });
    test("step", () => {
      const decimal = (x: string) => RomanNumeral.get(x).step;
      expect(RomanNumeral.names().map(decimal)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    test("invalid", () => {
      expect(RomanNumeral.get("nothing").name).toEqual("");
      expect(RomanNumeral.get("iI").name).toEqual("");
    });

    test("applied chords", () => {
      expect(RomanNumeral.get("V7/V")).toEqual({
        empty: false,
        name: "V7/V",
        roman: "V",
        interval: "2M",
        acc: "",
        chordType: "7",
        of: "V",
        major: true,
        step: 1,
        alt: 0,
        oct: 0,
        dir: 1,
      });
      const ivl = (x: string) => RomanNumeral.get(x).interval;
      expect($("V/I V/ii V/iii V/IV V/V V/vi").map(ivl)).toEqual(
        $("5P 6M 7M 1P 2M 3M"),
      );
      expect($("IV/IV viio7/V V/bVI V/#IV bII/V").map(ivl)).toEqual(
        $("7m 4A 3m 1A 6m"),
      );
      // nested: V of (V of V)
      expect(RomanNumeral.get("V/V/V").interval).toEqual("6M");
      expect(RomanNumeral.get("V/V/V").of).toEqual("V/V");
      expect(RomanNumeral.get("viio7/V").major).toBe(false);
    });

    test("applied chords are pitches", () => {
      const applied = RomanNumeral.get("V7/V");
      expect(interval(applied).name).toEqual("2M");
      expect(RomanNumeral.get(applied).name).toEqual("II");
    });

    test("invalid applied chords", () => {
      for (const name of ["V/VIII", "V7/ii7", "V//V", "I/E/V", "V/V7"]) {
        expect(RomanNumeral.get(name).empty).toBe(true);
      }
    });

    it("roman", () => {
      expect(RomanNumeral.get("IIIMaj7").roman).toEqual("III");
      expect(RomanNumeral.names().map((x) => RomanNumeral.get(x).name)).toEqual(
        RomanNumeral.names(),
      );
    });
  });

  test("tokenize", () => {
    expect(tokenize("bVIIMaj7")).toEqual(["bVIIMaj7", "b", "VII", "Maj7", ""]);
    expect(tokenize("V7/V")).toEqual(["V7/V", "", "V", "7", "V"]);
    expect(tokenize("viio7/bVI/ii")).toEqual([
      "viio7/bVI/ii",
      "",
      "vii",
      "o7",
      "bVI/ii",
    ]);
    // a slash not followed by a degree stays in the chord type
    expect(tokenize("I/E")).toEqual(["I/E", "", "I", "/E", ""]);
    expect(tokenize("C")).toEqual(["", "", "", "", ""]);
  });

  test("tokenize chord types with i or v", () => {
    expect(tokenize("viidim7")).toEqual(["viidim7", "", "vii", "dim7", ""]);
    expect(tokenize("iimin7")).toEqual(["iimin7", "", "ii", "min7", ""]);
    expect(tokenize("IVdim")).toEqual(["IVdim", "", "IV", "dim", ""]);
    expect(tokenize("#ivmi7")).toEqual(["#ivmi7", "#", "iv", "mi7", ""]);
    expect(tokenize("viidim7/V")).toEqual([
      "viidim7/V",
      "",
      "vii",
      "dim7",
      "V",
    ]);
    expect(tokenize("Idim/E")).toEqual(["Idim/E", "", "I", "dim/E", ""]);
    expect(RomanNumeral.get("VIIdim7")).toMatchObject({
      step: 6,
      alt: 0,
      chordType: "dim7",
    });
    // the roman numeral still takes as many letters as it can
    expect(tokenize("VII")).toEqual(["VII", "", "VII", "", ""]);
    expect(tokenize("viii")).toEqual(["", "", "", "", ""]);
    expect(tokenize("V/v/E")).toEqual(["", "", "", "", ""]);
  });

  it("create from degrees", () => {
    expect(
      [1, 2, 3, 4, 5, 6, 7].map((i) => RomanNumeral.get(i - 1).name),
    ).toEqual(RomanNumeral.names());
  });
});

describe("roman numeral input safety", () => {
  test("Object.prototype keys are not roman numerals", () => {
    for (const key of [
      "constructor",
      "toString",
      "__proto__",
      "hasOwnProperty",
    ]) {
      expect(RomanNumeral.get(key).empty).toBe(true);
    }
  });
});
