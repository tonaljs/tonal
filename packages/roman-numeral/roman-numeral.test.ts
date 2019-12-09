import { interval } from "@tonaljs/tonal";
import { names, romanNumeral, RomanNumeral } from "./index";

const $ = (str: string) => str.split(" ");

describe("tonal-roman-numeral", () => {
  test("names", () => {
    expect(names()).toEqual(["I", "II", "III", "IV", "V", "VI", "VII"]);
    expect(names(false)).toEqual(["i", "ii", "iii", "iv", "v", "vi", "vii"]);
  });

  describe("romanNumeral", () => {
    test("properties", () => {
      expect(romanNumeral("#VIIb5")).toEqual({
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
      expect(naturals.map(romanNumeral).map(n => n.name)).toEqual(
        $("I II III IV V VI VII")
      );
      const flats = $("1d 2m 3m 4d 5d 6m 7m").map(interval);
      expect(flats.map(romanNumeral).map(n => n.name)).toEqual(
        $("bI bII bIII bIV bV bVI bVII")
      );
      const sharps = $("1A 2A 3A 4A 5A 6A 7A").map(interval);
      expect(sharps.map(romanNumeral).map(n => n.name)).toEqual(
        $("#I #II #III #IV #V #VI #VII")
      );
    });
    test("Can convert to intervals", () => {
      expect(interval(romanNumeral("I")).name).toEqual("1P");
      expect(interval(romanNumeral("bIIImaj4")).name).toEqual("3m");
      expect(interval(romanNumeral("#IV7")).name).toEqual("4A");
    });
    test("step", () => {
      const decimal = (x: string) => romanNumeral(x).step;
      expect(names().map(decimal)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    test("invalid", () => {
      expect(romanNumeral("nothing").name).toEqual("");
      expect(romanNumeral("iI").name).toEqual("");
    });

    it("roman", () => {
      expect(romanNumeral("IIIMaj7").roman).toEqual("III");
      expect(names().map(x => romanNumeral(x).name)).toEqual(names());
    });
  });

  it("create from degrees", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(i => romanNumeral(i - 1).name)).toEqual(
      names()
    );
  });
});
