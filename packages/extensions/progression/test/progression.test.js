/* global describe test expect */
var prog = require("..");

describe("tonal-progression", () => {
  test("concrete", () => {
    expect(prog.concrete("I IIm7 V7", "C")).toEqual(["C", "Dm7", "G7"]);
    expect(prog.concrete("Imaj7 2 IIIm7", "C")).toEqual(["Cmaj7", null, "Em7"]);
    expect(prog.concrete("I II III IV V VI VII", "C")).toEqual([
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "B"
    ]);
    expect(prog.concrete("bI bII bIII bIV bV bVI bVII", "C")).toEqual([
      "Cb",
      "Db",
      "Eb",
      "Fb",
      "Gb",
      "Ab",
      "Bb"
    ]);
    expect(
      prog.concrete("#Im7 #IIm7 #III #IVMaj7 #V7 #VI #VIIo", "C")
    ).toEqual(["C#m7", "D#m7", "E#", "F#Maj7", "G#7", "A#", "B#o"]);
  });

  test("abstract", () => {
    expect(prog.abstract("Cmaj7 Dm7 G7", "C")).toEqual(["Imaj7", "IIm7", "V7"]);
  });

  test("progressions: build roman chord", () => {
    expect(
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(n) {
        return prog.buildRoman(n);
      })
    ).toEqual(["I", "II", "III", "IV", "V", "VI", "VII", "I", "II"]);
    expect(prog.buildRoman(2, -1)).toBe("bIII");
    expect(prog.buildRoman(3, 1, "dim")).toBe("#IVdim");
  });

  test("parseRomanChord", () => {
    expect(prog.parseRomanChord("V7")).toEqual({ type: "7", root: "5P" });
    expect(prog.parseRomanChord("IIm7")).toEqual({ type: "m7", root: "2M" });
    expect(prog.parseRomanChord("VIIo")).toEqual({ type: "o", root: "7M" });
  });

  test("romanRegex", () => {
    function exec(str) {
      return prog
        .romanRegex()
        .exec(str)
        .slice(0, 4);
    }
    var nums = "I II III IV V VI VII".split(" ");
    nums.forEach(function(n) {
      expect(exec(n)).toEqual([n, "", n, ""]);
      var l = n.toLowerCase();
      expect(exec(l)).toEqual([l, "", l, ""]);
    });

    nums.forEach(function(n) {
      "# ## b bb".split(" ").forEach(function(alt) {
        expect(exec(alt + n)).toEqual([alt + n, alt, n, ""]);
      });
    });

    expect(exec("bVImaj7")).toEqual(["bVImaj7", "b", "VI", "maj7"]);
    expect(exec("III dom")).toEqual(["III dom", "", "III", "dom"]);
  });
});
