import {
  enharmonic,
  simplify,
  transposeBy,
  transposeFifths,
  transposeFrom
} from "./index";

const $ = (str: string) => str.split(" ");

describe("note", () => {
  test("simplify", () => {
    expect(simplify("C#")).toEqual("C#");
    expect(simplify("C##")).toEqual("D");
    expect(simplify("C###")).toEqual("D#");
    expect(simplify("B#4")).toEqual("C5");
    const notes = $("C## C### F##4 Gbbb5 B#4 Cbb4");
    expect(notes.map(simplify)).toEqual($("D D# G4 E5 C5 Bb3"));
    expect(simplify("x")).toEqual("");
  });

  test("transposeFrom", () => {
    expect(transposeFrom("C4")("5P")).toEqual("G4");
    expect(["1P", "3M", "5P"].map(transposeFrom("C"))).toEqual(["C", "E", "G"]);
  });
  test("transposeBy", () => {
    expect(transposeBy("5P")("C4")).toEqual("G4");
    expect(["C", "D", "E"].map(transposeBy("5P"))).toEqual(["G", "A", "B"]);
  });

  test("enharmonic", () => {
    expect(enharmonic("C#")).toEqual("Db");
    expect(enharmonic("C##")).toEqual("D");
    expect(enharmonic("C###")).toEqual("Eb");
    expect(enharmonic("B#4")).toEqual("C5");
    const notes = $("C## C### F##4 Gbbb5 B#4 Cbb4");
    expect(notes.map(enharmonic)).toEqual($("D Eb G4 E5 C5 A#3"));
    expect(enharmonic("x")).toEqual("");
  });

  test("transposeFifths", () => {
    expect(transposeFifths("G4", 3)).toEqual("E6");
    expect(transposeFifths("G", 3)).toEqual("E");
    const ns = [0, 1, 2, 3, 4, 5].map(n => transposeFifths("C2", n));
    expect(ns).toEqual(["C2", "G2", "D3", "A3", "E4", "B4"]);
    const sharps = [0, 1, 2, 3, 4, 5, 6].map(n => transposeFifths("F#", n));
    expect(sharps).toEqual(["F#", "C#", "G#", "D#", "A#", "E#", "B#"]);
    const flats = [0, -1, -2, -3, -4, -5, -6].map(n =>
      transposeFifths("Bb", n)
    );
    expect(flats).toEqual(["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]);
  });
});
