/* global describe test expect */
var spell = require("..");

describe("tonal-spell", () => {
  test("get pitch class names", () => {
    expect(spell.pcnote(60)).toBe("C");
    expect(spell.pcnote(70)).toBe("Bb");
    expect(spell.pcnote(73)).toBe("Db");
  });

  test("get fifths from F", () => {
    expect("F C G D A E B".split(" ").map(spell.fifths)).toEqual([
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ]);
    expect("F# C# G# D# A# E# B#".split(" ").map(spell.fifths)).toEqual([
      7,
      8,
      9,
      10,
      11,
      12,
      13
    ]);
    expect("F## C## G## D## A## E## B##".split(" ").map(spell.fifths)).toEqual([
      14,
      15,
      16,
      17,
      18,
      19,
      20
    ]);
    expect("Bb Eb Ab Db Gb Cb Fb".split(" ").map(spell.fifths)).toEqual([
      -1,
      -2,
      -3,
      -4,
      -5,
      -6,
      -7
    ]);
    expect("Bbb Ebb Abb Dbb Gbb Cbb Fbb".split(" ").map(spell.fifths)).toEqual([
      -8,
      -9,
      -10,
      -11,
      -12,
      -13,
      -14
    ]);
  });

  test.skip("get note names", () => {
    var notes = "C D E F G A B".split(" ");
    var major = [0, 2, 4, 5, 7, 9, 11];
    var chromatic = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var tr = b => x => x + b;
    var scale = type => root =>
      type
        .map(tr(spell.pitch(root) + 60))
        .map(spell.pcIn(root))
        .join(" ");
    expect(notes.map(scale(major))).toEqual([
      "C D E F G A B",
      "D E F# G A B C#",
      "E F# G# A B C# D#",
      "F G A Bb C D E",
      "G A B C D E F#",
      "A B C# D E F# G#",
      "B C# D# E F# G# A#"
    ]);
    expect(notes.map(scale(chromatic))).toEqual([
      "C Db D Eb E F Gb G Ab A Bb B",
      "D Eb E F F# G G# A Bb B C C#",
      "E F F# G G# A Bb B C C# D D#",
      "F Gb G Ab A Bb B C Db D Eb E",
      "G Ab A Bb B C C# D Eb E F F#",
      "A Bb B C C# D D# E F F# G G#",
      "B C C# D D# E F F# G G# A A#"
    ]);
  });
});
