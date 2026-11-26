import { describe, expect, test } from "vitest";
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
      step: 0,
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

  test("simplify keeps the octave outside the midi range", () => {
    expect(Note.simplify("C10")).toEqual("C10");
    expect(Note.simplify("B#9")).toEqual("C10");
    expect(Note.simplify("G#9")).toEqual("G#9");
    expect(Note.simplify("Fb10")).toEqual("E10");
    expect(Note.simplify("Cb-1")).toEqual("B-2");
    expect(Note.simplify("Ab-2")).toEqual("Ab-2");
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
      "Bb",
    ]);
  });
  test("sortedNames", () => {
    expect(Note.sortedNames($("c f g a b h j"))).toEqual($("C F G A B"));
    expect(Note.sortedNames($("c f g a b h j j h b a g f c"))).toEqual(
      $("C C F F G G A A B B"),
    );
    expect(Note.sortedNames($("c2 c5 c1 c0 c6 c"))).toEqual(
      $("C C0 C1 C2 C5 C6"),
    );
    expect(Note.sortedNames($("c2 c5 c1 c0 c6 c"), Note.descending)).toEqual(
      $("C6 C5 C2 C1 C0 C"),
    );
  });

  test("sortedUniq", () => {
    expect(Note.sortedUniqNames($("a b c2 1p p2 c2 b c c3"))).toEqual(
      $("C A B C2 C3"),
    );
  });

  test("sortedUniq with enharmonic notes in between", () => {
    expect(Note.sortedUniqNames($("C4 B#3 C4 Dbb4"))).toEqual($("C4 B#3 Dbb4"));
    expect(Note.sortedUniqNames($("Dbb4 C4 B#3 C4"))).toEqual($("Dbb4 C4 B#3"));
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
      "G",
    ]);
  });
  test("transposeBy", () => {
    expect(Note.transposeBy("5P")("C4")).toEqual("G4");
    expect(["C", "D", "E"].map(Note.transposeBy("5P"))).toEqual([
      "G",
      "A",
      "B",
    ]);
  });

  test("enharmonic", () => {
    expect(Note.enharmonic("C#")).toEqual("Db");
    expect(Note.enharmonic("C##")).toEqual("D");
    expect(Note.enharmonic("C###")).toEqual("Eb");
    expect(Note.enharmonic("B#4")).toEqual("C5");
    const notes = $("C## C### F##4 Gbbb5 B#4 Cbb4");
    expect(notes.map((n) => Note.enharmonic(n))).toEqual(
      $("D Eb G4 E5 C5 A#3"),
    );
    expect(Note.enharmonic("x")).toEqual("");
    expect(Note.enharmonic("F2", "E#")).toBe("E#2");
    expect(Note.enharmonic("B2", "Cb")).toBe("Cb3");
    expect(Note.enharmonic("C2", "B#")).toBe("B#1");
    expect(Note.enharmonic("F2", "Eb")).toBe("");
  });

  test("transposeFifths", () => {
    expect(Note.transposeFifths("G4", 3)).toEqual("E6");
    expect(Note.transposeFifths("G", 3)).toEqual("E");
    const ns = [0, 1, 2, 3, 4, 5].map((n) => Note.transposeFifths("C2", n));
    expect(ns).toEqual(["C2", "G2", "D3", "A3", "E4", "B4"]);
    const sharps = [0, 1, 2, 3, 4, 5, 6].map((n) =>
      Note.transposeFifths("F#", n),
    );
    expect(sharps).toEqual(["F#", "C#", "G#", "D#", "A#", "E#", "B#"]);
    const flats = [0, -1, -2, -3, -4, -5, -6].map((n) =>
      Note.transposeFifths("Bb", n),
    );
    expect(flats).toEqual(["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]);
  });

  test("transposeOctaves", () => {
    expect(
      [0, 1, 2, 3, 4].map((oct) => Note.transposeOctaves("C4", oct)).join(" "),
    ).toEqual("C4 C5 C6 C7 C8");
    expect(
      [-1, -2, -3, -4, -5]
        .map((oct) => Note.transposeOctaves("C4", oct))
        .join(" "),
    ).toEqual("C3 C2 C1 C0 C-1");
  });

  test("fromFreq", () => {
    expect(Note.fromFreq(440)).toEqual("A4");
    expect(Note.fromFreq(444)).toEqual("A4");
    expect(Note.fromFreq(470)).toEqual("Bb4");
    expect(Note.fromFreqSharps(470)).toEqual("A#4");
    expect(Note.fromFreq(0)).toEqual("");
    expect(Note.fromFreq(NaN)).toEqual("");
  });

  describe("fold", () => {
    test("the whole figure", () => {
      expect(Note.fold($("C2 E2 G2 Bb2"), ["E2", "G3"])).toEqual(
        $("C3 E3 G3 Bb3"),
      );
      expect(Note.fold($("C5 E5 G5"), ["C3", "C5"])).toEqual($("C4 E4 G4"));
      // already in the range: it doesn't move
      expect(Note.fold($("E3 G3"), ["C3", "C5"])).toEqual($("E3 G3"));
      // the fewest octaves
      expect(Note.fold($("C1 E1"), ["C3", "C6"])).toEqual($("C3 E3"));
      expect(Note.fold($("C7 E7"), ["C3", "C6"])).toEqual($("C5 E5"));
      // too wide: the lowest note in the lowest octave at or above low
      expect(Note.fold($("C2 E4"), ["E2", "G3"])).toEqual($("C3 E5"));
      // the spelling is kept
      expect(Note.fold($("Cb1 E#1"), ["C2", "C4"])).toEqual($("Cb3 E#3"));
    });

    test("each note", () => {
      expect(
        Note.fold($("C2 E2 G2 Bb2"), ["E2", "G3"], { each: true }),
      ).toEqual($("C3 E2 G2 Bb2"));
      expect(Note.fold($("C1 G5 E3"), ["C3", "C4"], { each: true })).toEqual(
        $("C3 G3 E3"),
      );
      // a range under an octave: the octave nearest the range
      expect(Note.fold($("C4 F#4 A4"), ["D4", "G4"], { each: true })).toEqual(
        $("C4 F#4 A4"),
      );
      expect(Note.fold($("C5 A2"), ["D4", "G4"], { each: true })).toEqual(
        $("C4 A4"),
      );
      // a tie goes up
      expect(Note.fold(["C4"], ["D4", "Bb4"], { each: true })).toEqual(["C5"]);
      // each: false is the whole figure
      expect(Note.fold($("C2 E2"), ["E2", "G3"], { each: false })).toEqual(
        $("C3 E3"),
      );
    });

    test("pitch classes", () => {
      // the lowest octave at or above low
      expect(Note.fold($("D G C"), ["E2", "D3"])).toEqual($("D3 G2 C3"));
      expect(Note.fold($("E"), ["E2", "D3"])).toEqual(["E2"]);
      expect(Note.fold($("Cb F#"), ["C3", "C5"], { each: true })).toEqual(
        $("Cb4 F#3"),
      );
      // a range under an octave: the nearest octave (ties go up)
      expect(Note.fold($("C A"), ["D4", "G4"])).toEqual($("C4 A4"));
      // with notes: the notes move together, the pitch classes on their own
      expect(Note.fold($("C2 E2 G"), ["E2", "G3"])).toEqual($("C3 E3 G2"));
      expect(Note.fold($("C2 E2 G"), ["E2", "G3"], { each: true })).toEqual(
        $("C3 E2 G2"),
      );
    });

    test("invalid", () => {
      expect(Note.fold([], ["C3", "C4"])).toEqual([]);
      expect(Note.fold(["x"], ["C3", "C4"])).toEqual([]);
      expect(Note.fold(["C4", "x"], ["C3", "C4"])).toEqual([]);
      expect(Note.fold(["C4"], ["C4", "C3"])).toEqual([]);
      expect(Note.fold(["C4"], ["C", "C4"])).toEqual([]);
      expect(Note.fold(["C4"], ["C3"] as never)).toEqual([]);
      expect(Note.fold(["C4"], ["C3", "C5"], null as never)).toEqual(["C4"]);
    });
  });
});
