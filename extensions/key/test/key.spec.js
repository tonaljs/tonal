import * as key from "../index";

describe("tonal-key", () => {
  test("modeNames", () => {
    expect(key.modeNames().join(" ")).toEqual(
      "major dorian phrygian lydian mixolydian minor locrian"
    );
    expect(key.modeNames(true).join(" ")).toEqual(
      "major dorian phrygian lydian mixolydian minor locrian ionian aeolian"
    );
  });
  test("names", () => {
    expect(key.names(0)).toEqual(["C major"]);
    expect(key.names().join("|")).toEqual(
      "Ab major|Eb major|Bb major|F major|C major|G major|D major|A major|E major"
    );
  });

  test("degrees", () => {
    const major = ["I", "ii", "iii", "IV", "V", "vi", "vii"];
    expect(key.degrees("C major")).toEqual(major);
    const dorian = ["i", "ii", "III", "IV", "v", "vi", "VII"];
    expect(key.degrees("D dorian")).toEqual(dorian);
  });

  test("props", () => {
    expect(key.props("d mixolydian")).toEqual({
      name: "D mixolydian",
      tonic: "D",
      mode: "mixolydian",
      alt: 1,
      acc: "#",
      modenum: 4,
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7m"],
      scale: ["D", "E", "F#", "G", "A", "B", "C"]
    });
    expect(key.props("none").name).toBe(null);
  });

  test("alteration", () => {
    expect(key.props("A major").alt).toBe(3);
    var Amaj = "A B C# D E F# G#".split(" ");
    var modes = key.modeNames(false);
    Amaj.forEach(function(tonic, i) {
      expect(key.props(tonic + " " + modes[i]).alt).toBe(3);
    });
    expect(key.props("Bb major").alt).toBe(-2);
  });

  test("alteredNotes", () => {
    expect(key.alteredNotes("Eb major")).toEqual(["Bb", "Eb", "Ab"]);
    expect(key.alteredNotes("A major")).toEqual(["F#", "C#", "G#"]);
  });

  test("scale", () => {
    expect(key.scale("G locrian").join(" ")).toEqual("G Ab Bb C Db Eb F");
  });

  test("leadsheetSymbols", () => {
    const symbols = ["M", "m", "m", "M", "M7", "m", "dim"];
    expect(key.leadsheetSymbols(symbols, "C major").join(" ")).toEqual(
      "CM Dm Em FM GM7 Am Bdim"
    );
  });

  test("chords", () => {
    expect(key.chords("A major").join(" ")).toEqual(
      "AMaj7 Bm7 C#m7 DMaj7 E7 F#m7 G#m7b5"
    );
    expect(key.chords("Bb dorian").join(" ")).toEqual(
      "Bbm7 Cm7 DbMaj7 Eb7 Fm7 Gm7b5 AbMaj7"
    );
  });

  test("chords with degrees", () => {
    expect(key.chords("A major", ["i", "ii", "vii"]).join(" ")).toEqual(
      "AMaj7 Bm7 G#m7b5"
    );
    expect(key.chords("A major", ["V", "IV", "I"]).join(" ")).toEqual(
      "E7 DMaj7 AMaj7"
    );
    expect(key.chords("Bb dorian", [5, 4, 1]).join(" ")).toEqual(
      "Fm7 Eb7 Bbm7"
    );
  });

  test("triads", () => {
    expect(key.triads("A major").join(" ")).toEqual("A Bm C#m D E F#m G#dim");
    expect(key.triads("Bb dorian").join(" ")).toEqual(
      "Bbm Cm Db Eb Fm Gdim Ab"
    );
  });

  test("secDomChords", () => {
    expect(key.secDomChords("C major").join(" ")).toEqual(
      "G7 A7 B7 C7 D7 E7 F#7"
    );
  });

  test("modenum", () => {
    expect(key.props("C major").modenum).toEqual(key.props("C ionian").modenum);
    expect(key.props("C minor").modenum).toEqual(
      key.props("C aeolian").modenum
    );
  });

  test("relative", () => {
    expect(key.relative("major", "A minor")).toEqual("C major");
    expect(key.relative("major", "D minor")).toEqual("F major");
    expect(key.relative("minor", "D dorian")).toEqual("A minor");
  });

  test("tokenize", () => {
    expect(key.tokenize("C major")).toEqual(["C", "major"]);
    expect(key.tokenize("Cb5 lydian")).toEqual(["Cb", "lydian"]);
    expect(key.tokenize("Ax6 Dorian")).toEqual(["A##", "dorian"]);
    expect(key.tokenize("dorian")).toEqual([null, null]);
    expect(key.tokenize("blah")).toEqual([null, null]);
  });
});
