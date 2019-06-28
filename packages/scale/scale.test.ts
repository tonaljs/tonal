import { aliases, isKnown, names, scale, tokenize } from "./index";
const $ = (s: string) => s.split(" ");

describe("@tonaljs/scale", () => {
  test.only("scale", () => {
    expect(scale("major")).toEqual({
      empty: false,
      tonic: "",
      notes: [],
      type: "major",
      name: "major",
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      aliases: ["ionian"],
      num: 2773,
      chroma: "101011010101",
      normalized: "101011010101",
      length: 7
    });
    expect(scale("c5 pentatonic")).toEqual({
      empty: false,
      name: "C5 pentatonic",
      type: "major pentatonic",
      tonic: "C5",
      notes: ["C5", "D5", "E5", "G5", "A5"],
      intervals: ["1P", "2M", "3M", "5P", "6M"],
      aliases: ["pentatonic"],
      num: 2708,
      chroma: "101010010100",
      normalized: "101010010100",
      length: 5
    });
    expect(scale("C4 major")).toEqual(scale("C4", "major"));
  });

  test("tokenize", () => {
    expect(tokenize("c major")).toEqual(["C", "major"]);
    expect(tokenize("cb3 major")).toEqual(["Cb3", "major"]);
    expect(tokenize("melodic minor")).toEqual(["", "melodic minor"]);
    expect(tokenize("c")).toEqual(["C", ""]);
    expect(tokenize("")).toEqual(["", ""]);
  });
  test("isKnown", () => {
    expect(isKnown("major")).toBe(true);
    expect(isKnown("Db major")).toBe(true);
    expect(isKnown("Maj7")).toBe(false);
  });

  test("intervals", () => {
    expect(scale("major").intervals).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(scale("C major").intervals).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(scale("blah").intervals).toEqual([]);
  });

  test("notes", () => {
    expect(scale("C major").notes).toEqual($("C D E F G A B"));
    expect(scale("C", "major").notes).toEqual($("C D E F G A B"));
    expect(scale("C4", "major").notes).toEqual($("C4 D4 E4 F4 G4 A4 B4"));
    expect(scale("eb", "bebop").notes).toEqual($("Eb F G Ab Bb C Db D"));
    expect(scale("C", "no-scale").notes).toEqual([]);
    expect(scale("no-note", "major").notes).toEqual([]);
  });

  test("names and aliases", () => {
    // no need to test behaviour (it's a re-export), just existence
    expect(typeof names()[0]).toBe("string");
    expect(typeof aliases()[0]).toBe("string");
  });
  /*

  test('mode names', () => {
    expect(modeNames('pentatonic')).toEqual([
      ['1P', 'major pentatonic'],
      ['2M', 'egyptian'],
      ['3M', 'malkos raga'],
      ['5P', 'ritusen'],
      ['6M', 'minor pentatonic']
    ])
    expect(modeNames('whole tone pentatonic')).toEqual([
      ['1P', 'whole tone pentatonic']
    ])
    expect(modeNames('C pentatonic')).toEqual([
      ['C', 'major pentatonic'],
      ['D', 'egyptian'],
      ['E', 'malkos raga'],
      ['G', 'ritusen'],
      ['A', 'minor pentatonic']
    ])
    expect(modeNames('C whole tone pentatonic')).toEqual([
      ['C', 'whole tone pentatonic']
    ])
  })

  test('chords: find all chords that fits into this scale', () => {
    expect(chords('pentatonic')).toEqual($('5 Madd9 M 6 sus2'))
    expect(chords('none')).toEqual([])
  })

  test('supersets: find all scales that extends this one', () => {
    expect(supersets('major')).toEqual([
      'bebop',
      'bebop major',
      'chromatic',
      'ichikosucho'
    ])
    expect(supersets('none')).toEqual([])
  })

  test('subsets: all scales that are included in the given one', () => {
    expect(subsets('major')).toEqual([
      'ionian pentatonic',
      'major pentatonic',
      'ritusen'
    ])
    expect(subsets('none')).toEqual([])
  })

  test('toScale', () => {
    expect(toScale($('C4 c3 C5 C4 c4'))).toEqual(['C'])
    expect(toScale($('C4 f3 c#10 b5 d4 cb4'))).toEqual($('C C# D F B Cb'))
    expect(toScale($('D4 c#5 A5 F#6'))).toEqual(['D', 'F#', 'A', 'C#'])
  })
  */
});
