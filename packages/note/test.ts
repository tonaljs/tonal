import Note from "./index";

const $ = (str: string) => str.split(" ");

describe("note", () => {
  test("get", () => {
    expect(Note.get("C4")).toEqual({
      acc: "",
      alt: 0,
      chroma: 0,
      coord: [0, 4],
      empty: false,
      freq: 261.6255653005986,
      height: 60,
      letter: "C",
      midi: 60,
      name: "C4",
      oct: 4,
      pc: "C",
      step: 0
    });
    expect(Note.get("C4")).toEqual(Note.get(Note.get("C4")));
  });
  test("property shorthands", () => {
    expect(Note.name("db")).toEqual("Db");
    expect(Note.pitchClass("Ax4")).toEqual("A##");
    expect(Note.chroma("db4")).toEqual(1);
    expect(Note.midi("db4")).toEqual(61);
    expect(Note.freq("A4")).toEqual(440);
  });
  test("simplify", () => {
    expect(Note.simplify("C#")).toEqual("C#");
    expect(Note.simplify("C##")).toEqual("D");
    expect(Note.simplify("C###")).toEqual("D#");
    expect(Note.simplify("B#4")).toEqual("C5");
    const notes = $("C## C### F##4 Gbbb5 B#4 Cbb4");
    expect(notes.map(Note.simplify)).toEqual($("D D# G4 E5 C5 Bb3"));
    expect(Note.simplify("x")).toEqual("");
  });

  test("from midi", () => {
    expect(Note.fromMidi(70)).toEqual("Bb4");
    expect([60, 61, 62].map(Note.fromMidi)).toEqual(["C4", "Db4", "D4"]);
    expect([60, 61, 62].map(Note.fromMidiSharps)).toEqual(["C4", "C#4", "D4"]);
  });

  test("names", () => {
    expect(Note.names()).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
    expect(Note.names(["fx", "bb", 12, "nothing", {}, null])).toEqual([
      "F##",
      "Bb"
    ]);
  });
  test("sortedNames", () => {
    expect(Note.sortedNames($("c f g a b h j"))).toEqual($("C F G A B"));
    expect(Note.sortedNames($("c f g a b h j j h b a g f c"))).toEqual(
      $("C C F F G G A A B B")
    );
    expect(Note.sortedNames($("c2 c5 c1 c0 c6 c"))).toEqual(
      $("C C0 C1 C2 C5 C6")
    );
    expect(Note.sortedNames($("c2 c5 c1 c0 c6 c"), Note.descending)).toEqual(
      $("C6 C5 C2 C1 C0 C")
    );
  });

  test("sortedUniq", () => {
    expect(Note.sortedUniqNames($("a b c2 1p p2 c2 b c c3"))).toEqual(
      $("C A B C2 C3")
    );
  });

  test("transpose", () => {
    expect(Note.transpose("A4", "3M")).toEqual("C#5");
    expect(Note.tr("A4", "3M")).toEqual("C#5");
  });

  test("transposeFrom", () => {
    expect(Note.transposeFrom("C4")("5P")).toEqual("G4");
    expect(["1P", "3M", "5P"].map(Note.transposeFrom("C"))).toEqual([
      "C",
      "E",
      "G"
    ]);
  });
  test("transposeBy", () => {
    expect(Note.transposeBy("5P")("C4")).toEqual("G4");
    expect(["C", "D", "E"].map(Note.transposeBy("5P"))).toEqual([
      "G",
      "A",
      "B"
    ]);
  });

  test("enharmonic", () => {
    expect(Note.enharmonic("C#")).toEqual("Db");
    expect(Note.enharmonic("C##")).toEqual("D");
    expect(Note.enharmonic("C###")).toEqual("Eb");
    expect(Note.enharmonic("B#4")).toEqual("C5");
    const notes = $("C## C### F##4 Gbbb5 B#4 Cbb4");
    expect(notes.map(Note.enharmonic)).toEqual($("D Eb G4 E5 C5 A#3"));
    expect(Note.enharmonic("x")).toEqual("");
  });

  test("transposeFifths", () => {
    expect(Note.transposeFifths("G4", 3)).toEqual("E6");
    expect(Note.transposeFifths("G", 3)).toEqual("E");
    const ns = [0, 1, 2, 3, 4, 5].map(n => Note.transposeFifths("C2", n));
    expect(ns).toEqual(["C2", "G2", "D3", "A3", "E4", "B4"]);
    const sharps = [0, 1, 2, 3, 4, 5, 6].map(n =>
      Note.transposeFifths("F#", n)
    );
    expect(sharps).toEqual(["F#", "C#", "G#", "D#", "A#", "E#", "B#"]);
    const flats = [0, -1, -2, -3, -4, -5, -6].map(n =>
      Note.transposeFifths("Bb", n)
    );
    expect(flats).toEqual(["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]);
  });
});
