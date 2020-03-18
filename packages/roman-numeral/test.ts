import { interval } from "@tonaljs/core";
import RomanNumeral from "./index";

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
      "VII"
    ]);
    expect(RomanNumeral.names(false)).toEqual([
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii"
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
        major: true,
        step: 6,
        alt: 1,
        oct: 0,
        dir: 1
      });
    });
    test("RomanNumeral is compatible with Pitch", () => {
      const naturals = $("1P 2M 3M 4P 5P 6M 7M").map(interval);
      expect(naturals.map(RomanNumeral.get).map(n => n.name)).toEqual(
        $("I II III IV V VI VII")
      );
      const flats = $("1d 2m 3m 4d 5d 6m 7m").map(interval);
      expect(flats.map(RomanNumeral.get).map(n => n.name)).toEqual(
        $("bI bII bIII bIV bV bVI bVII")
      );
      const sharps = $("1A 2A 3A 4A 5A 6A 7A").map(interval);
      expect(sharps.map(RomanNumeral.get).map(n => n.name)).toEqual(
        $("#I #II #III #IV #V #VI #VII")
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

    it("roman", () => {
      expect(RomanNumeral.get("IIIMaj7").roman).toEqual("III");
      expect(RomanNumeral.names().map(x => RomanNumeral.get(x).name)).toEqual(
        RomanNumeral.names()
      );
    });
  });

  it("create from degrees", () => {
    expect(
      [1, 2, 3, 4, 5, 6, 7].map(i => RomanNumeral.get(i - 1).name)
    ).toEqual(RomanNumeral.names());
  });
});
