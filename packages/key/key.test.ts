import { key, tokenize } from "./index";

describe("tonal-key", () => {
  test("props", () => {
    expect(key("d mixolydian")).toEqual({
      valid: true,
      name: "D mixolydian",
      tonic: "D",
      triad: "D",
      seventh: "D7",
      alt: 1,
      acc: "#",
      alteredNotes: ["F#"],
      modeName: "mixolydian",
      aliases: [],
      modeNum: 4,
      pcset: 2774,
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7m"],
      scale: ["D", "E", "F#", "G", "A", "B", "C"]
    });
    expect(key("none")).toBe(null);
  });
  test("tokenize", () => {
    expect(tokenize("C major")).toEqual(["C", "major"]);
    expect(tokenize("Cb5 lydian")).toEqual(["Cb", "lydian"]);
    expect(tokenize("Ax6 Dorian")).toEqual(["A##", "dorian"]);
    expect(tokenize("dorian")).toEqual(["", "dorian"]);
    expect(tokenize("blah")).toEqual(["", "blah"]);
  });
  /*
  test('names', () => {
    expect(names(0)).toEqual(['C major'])
    expect(names().join('|')).toEqual(
      'Ab major|Eb major|Bb major|F major|C major|G major|D major|A major|E major'
    )
  })

  test('degrees', () => {
    const major = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii']
    expect(degrees('C major')).toEqual(major)
    const dorian = ['i', 'ii', 'III', 'IV', 'v', 'vi', 'VII']
    expect(degrees('D dorian')).toEqual(dorian)
  })


  test('alteration', () => {
    expect(props('A major').alt).toBe(3)
    var Amaj = 'A B C# D E F# G#'.split(' ')
    var modes = modeNames(false)
    Amaj.forEach(function(tonic, i) {
      expect(props(tonic + ' ' + modes[i]).alt).toBe(3)
    })
    expect(props('Bb major').alt).toBe(-2)
  })

  test('alteredNotes', () => {
    expect(alteredNotes('Eb major')).toEqual(['Bb', 'Eb', 'Ab'])
    expect(alteredNotes('A major')).toEqual(['F#', 'C#', 'G#'])
  })

  test('scale', () => {
    expect(scale('G locrian').join(' ')).toEqual('G Ab Bb C Db Eb F')
  })

  test('leadsheetSymbols', () => {
    const symbols = ['M', 'm', 'm', 'M', 'M7', 'm', 'dim']
    expect(leadsheetSymbols(symbols, 'C major').join(' ')).toEqual(
      'CM Dm Em FM GM7 Am Bdim'
    )
  })

  test('chords', () => {
    expect(chords('A major').join(' ')).toEqual(
      'AMaj7 Bm7 C#m7 DMaj7 E7 F#m7 G#m7b5'
    )
    expect(chords('Bb dorian').join(' ')).toEqual(
      'Bbm7 Cm7 DbMaj7 Eb7 Fm7 Gm7b5 AbMaj7'
    )
  })

  test('chords with degrees', () => {
    expect(chords('A major', ['i', 'ii', 'vii']).join(' ')).toEqual(
      'AMaj7 Bm7 G#m7b5'
    )
    expect(chords('A major', ['V', 'IV', 'I']).join(' ')).toEqual(
      'E7 DMaj7 AMaj7'
    )
    expect(chords('Bb dorian', [5, 4, 1]).join(' ')).toEqual('Fm7 Eb7 Bbm7')
  })

  test('triads', () => {
    expect(triads('A major').join(' ')).toEqual('A Bm C#m D E F#m G#dim')
    expect(triads('Bb dorian').join(' ')).toEqual('Bbm Cm Db Eb Fm Gdim Ab')
  })

  test('secDomChords', () => {
    expect(secDomChords('C major').join(' ')).toEqual('G7 A7 B7 C7 D7 E7 F#7')
  })

  test('modenum', () => {
    expect(props('C major').modenum).toEqual(props('C ionian').modenum)
    expect(props('C minor').modenum).toEqual(props('C aeolian').modenum)
  })

  test('relative', () => {
    expect(relative('major', 'A minor')).toEqual('C major')
    expect(relative('major', 'D minor')).toEqual('F major')
    expect(relative('minor', 'D dorian')).toEqual('A minor')
  })

  */
});
