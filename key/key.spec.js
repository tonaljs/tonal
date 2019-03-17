import Key from ".";

describe("tonal-key", () => {
  test("modeNames", () => {
    expect(Key.modeNames().join(" ")).toEqual(
      "major dorian phrygian lydian mixolydian minor locrian"
    );
    expect(Key.modeNames(true).join(" ")).toEqual(
      "major dorian phrygian lydian mixolydian minor locrian ionian aeolian"
    );
  });
  test("names", () => {
    expect(Key.names(0)).toEqual(["C major"]);
    expect(Key.names().join("|")).toEqual(
      "Ab major|Eb major|Bb major|F major|C major|G major|D major|A major|E major"
    );
  });

  test("degrees", () => {
    const major = ["I", "ii", "iii", "IV", "V", "vi", "vii"];
    expect(Key.degrees("C major")).toEqual(major);
    const dorian = ["i", "ii", "III", "IV", "v", "vi", "VII"];
    expect(Key.degrees("D dorian")).toEqual(dorian);
  });

  test("props", () => {
    expect(Key.props("d mixolydian")).toEqual({
      name: "D mixolydian",
      tonic: "D",
      mode: "mixolydian",
      alt: 1,
      acc: "#",
      modenum: 4,
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7m"],
      scale: ["D", "E", "F#", "G", "A", "B", "C"]
    });
    expect(Key.props("none").name).toBe(null);
  });

  test("alteration", () => {
    expect(Key.props("A major").alt).toBe(3);
    var Amaj = "A B C# D E F# G#".split(" ");
    var modes = Key.modeNames(false);
    Amaj.forEach(function(tonic, i) {
      expect(Key.props(tonic + " " + modes[i]).alt).toBe(3);
    });
    expect(Key.props("Bb major").alt).toBe(-2);
  });

  test("alteredNotes", () => {
    expect(Key.alteredNotes("Eb major")).toEqual(["Bb", "Eb", "Ab"]);
    expect(Key.alteredNotes("A major")).toEqual(["F#", "C#", "G#"]);
  });

  test("scale", () => {
    expect(Key.scale("G locrian").join(" ")).toEqual("G Ab Bb C Db Eb F");
  });

  test("leadsheetSymbols", () => {
    const symbols = ["M", "m", "m", "M", "M7", "m", "dim"];
    expect(Key.leadsheetSymbols(symbols, "C major").join(" ")).toEqual(
      "CM Dm Em FM GM7 Am Bdim"
    );
  });

  test("chords", () => {
    expect(Key.chords("A major").join(" ")).toEqual(
      "AMaj7 Bm7 C#m7 DMaj7 E7 F#m7 G#m7b5"
    );
    expect(Key.chords("Bb dorian").join(" ")).toEqual(
      "Bbm7 Cm7 DbMaj7 Eb7 Fm7 Gm7b5 AbMaj7"
    );
  });

  test("chords with degrees", () => {
    expect(Key.chords("A major", ["i", "ii", "vii"]).join(" ")).toEqual(
      "AMaj7 Bm7 G#m7b5"
    );
    expect(Key.chords("A major", ["V", "IV", "I"]).join(" ")).toEqual(
      "E7 DMaj7 AMaj7"
    );
    expect(Key.chords("Bb dorian", [5, 4, 1]).join(" ")).toEqual(
      "Fm7 Eb7 Bbm7"
    );
  });

  test("triads", () => {
    expect(Key.triads("A major").join(" ")).toEqual("A Bm C#m D E F#m G#dim");
    expect(Key.triads("Bb dorian").join(" ")).toEqual(
      "Bbm Cm Db Eb Fm Gdim Ab"
    );
  });

  test("secDomChords", () => {
    expect(Key.secDomChords("C major").join(" ")).toEqual(
      "G7 A7 B7 C7 D7 E7 F#7"
    );
  });

  test("modenum", () => {
    expect(Key.props("C major").modenum).toEqual(Key.props("C ionian").modenum);
    expect(Key.props("C minor").modenum).toEqual(
      Key.props("C aeolian").modenum
    );
  });

  test("relative", () => {
    expect(Key.relative("major", "A minor")).toEqual("C major");
    expect(Key.relative("major", "D minor")).toEqual("F major");
    expect(Key.relative("minor", "D dorian")).toEqual("A minor");
  });

  test("tokenize", () => {
    expect(Key.tokenize("C major")).toEqual(["C", "major"]);
    expect(Key.tokenize("Cb5 lydian")).toEqual(["Cb", "lydian"]);
    expect(Key.tokenize("Ax6 Dorian")).toEqual(["A##", "dorian"]);
    expect(Key.tokenize("dorian")).toEqual([null, null]);
    expect(Key.tokenize("blah")).toEqual([null, null]);
  });
});
