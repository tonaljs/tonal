import { describe, expect, test } from "vitest";
import * as ChordType from "@tonaljs/chord-type";
import { note } from "@tonaljs/pitch-note";
import * as Chord from "./index";

const pc = (name: string) => note(name).chroma;

describe("tensions", () => {
  test("by the chord's 3rd, 5th and 7th", () => {
    expect(Chord.tensions("C7")).toEqual(["b9", "9", "#9", "#11", "b13", "13"]);
    expect(Chord.tensions("Cmaj7")).toEqual(["9", "#11", "13"]);
    expect(Chord.tensions("C")).toEqual(["9", "#11", "13"]);
    expect(Chord.tensions("C6")).toEqual(["9", "#11", "7"]);
    expect(Chord.tensions("Caug")).toEqual(["9", "#11"]);
    expect(Chord.tensions("C7#5")).toEqual(["9", "#11"]);
    expect(Chord.tensions("C7sus4")).toEqual(["b9", "9", "13"]);
    expect(Chord.tensions("CmMaj7")).toEqual(["9", "11", "13"]);
    expect(Chord.tensions("Cm6")).toEqual(["9", "11", "7"]);
    expect(Chord.tensions("Cm7")).toEqual(["9", "11"]);
    expect(Chord.tensions("Cm")).toEqual(["9", "11"]);
    expect(Chord.tensions("Cm7b5")).toEqual(["9", "11", "b13"]);
    expect(Chord.tensions("Cdim7")).toEqual(["9", "11", "b13", "7"]);
    expect(Chord.tensions("C5")).toEqual(["9", "11", "13"]);
  });

  test("without what the chord already says", () => {
    expect(Chord.tensions("C9")).toEqual(["#11", "b13", "13"]);
    expect(Chord.tensions("C13")).toEqual(["#11"]);
    expect(Chord.tensions("C7b9")).toEqual(["#9", "#11", "b13", "13"]);
    expect(Chord.tensions("C7#9b13")).toEqual(["b9", "#11"]);
    expect(Chord.tensions("C7b5")).toEqual(["b9", "9", "#9", "b13", "13"]);
    expect(Chord.tensions("Cmaj7#11")).toEqual(["9", "13"]);
    expect(Chord.tensions("C6/9")).toEqual(["#11", "7"]);
  });

  test("chord types, slash chords and invalid chords", () => {
    expect(Chord.tensions("m7")).toEqual(["9", "11"]);
    expect(Chord.tensions("Cmaj7/E")).toEqual(["9", "#11", "13"]);
    expect(Chord.tensions("nonsense")).toEqual([]);
    expect(Chord.tensions("")).toEqual([]);
  });

  test("every chord type has tensions, and none is a chord tone", () => {
    // chords that already spell every tension
    const spelled = [
      ...["9#5#11", "M13#11", "13#11", "9#11b13", "m11A", "m11"],
      "7#5b9#11",
    ];
    for (const type of ChordType.all()) {
      const symbol = "C" + type.aliases[0];
      const list = Chord.tensions(symbol);
      const tones = Chord.get(symbol).notes.map(pc);
      for (const t of list) {
        expect(tones).not.toContain(pc(Chord.noteOf(symbol, t)));
      }
      if (!spelled.includes(type.aliases[0])) {
        expect([symbol, list.length > 0]).toEqual([symbol, true]);
      }
    }
  });
});

describe("classify", () => {
  test("without context", () => {
    expect(Chord.classify("Cmaj7", "E")).toEqual("chord tone");
    expect(Chord.classify("Cmaj7", "D")).toEqual("tension");
    expect(Chord.classify("Cmaj7", "F#")).toEqual("tension");
    expect(Chord.classify("Cmaj7", "F")).toEqual("avoid");
    expect(Chord.classify("Cmaj7", "Bb")).toEqual("avoid");
    expect(Chord.classify("Cmaj7", "Eb")).toEqual("avoid");
    expect(Chord.classify("C7", "Db")).toEqual("tension");
    expect(Chord.classify("C7", "D#")).toEqual("tension");
    expect(Chord.classify("C7", "F")).toEqual("avoid");
    expect(Chord.classify("C7", "B")).toEqual("avoid");
    expect(Chord.classify("Dm7", "B")).toEqual("outside");
    expect(Chord.classify("Dm7", "F#")).toEqual("avoid");
    expect(Chord.classify("Cm7b5", "D")).toEqual("tension");
    expect(Chord.classify("Cm7b5", "G")).toEqual("avoid");
    expect(Chord.classify("Cdim7", "B")).toEqual("tension");
    expect(Chord.classify("Cdim7", "Bb")).toEqual("avoid");
    expect(Chord.classify("C6", "B")).toEqual("tension");
  });

  test("the octave and spelling don't matter, the bass is a chord tone", () => {
    expect(Chord.classify("C7", "C#5")).toEqual("tension");
    expect(Chord.classify("Cmaj7", "E#")).toEqual("avoid");
    expect(Chord.classify("C/Bb", "Bb")).toEqual("chord tone");
  });

  test("with a key or a scale", () => {
    expect(Chord.classify("Dm7", "B", { key: "C major" })).toEqual("tension");
    expect(Chord.classify("Dm7", "Bb", { key: "F major" })).toEqual("avoid");
    expect(Chord.classify("Dm7", "B", { key: "F major" })).toEqual("outside");
    expect(Chord.classify("Em7", "F", { key: "C major" })).toEqual("avoid");
    expect(Chord.classify("Em7", "C", { key: "C major" })).toEqual("avoid");
    expect(Chord.classify("Em7", "A", { key: "C major" })).toEqual("tension");
    expect(Chord.classify("Bm7b5", "C", { key: "C major" })).toEqual("avoid");
    expect(Chord.classify("G7", "C", { key: "C major" })).toEqual("avoid");
    expect(Chord.classify("G7", "Ab", { key: "C major" })).toEqual("outside");
    expect(
      Chord.classify("G7", "Ab", { scale: "G phrygian dominant" }),
    ).toEqual("tension");
    expect(Chord.classify("Fmaj7", "B", { key: "C major" })).toEqual("tension");
    // the scale wins over the key
    expect(
      Chord.classify("G7", "Ab", { key: "C major", scale: "G altered" }),
    ).toEqual("tension");
  });

  test("the tensions option", () => {
    expect(Chord.classify("Dm7", "B", { tensions: ["9", "11", "13"] })).toEqual(
      "tension",
    );
    const lessDominant = Chord.tensions("C7").filter((t) => t !== "b9");
    expect(Chord.classify("C7", "Db", { tensions: lessDominant })).toEqual(
      "avoid",
    );
    expect(
      Chord.classify("Cmaj7", "F", {
        tensions: [...Chord.tensions("Cmaj7"), "11"],
      }),
    ).toEqual("tension");
  });

  test("every pitch class gets one class, for every chord type", () => {
    const classes = ["chord tone", "tension", "avoid", "outside"];
    const notes = "C Db D Eb E F F# G Ab A Bb B".split(" ");
    for (const type of ChordType.all()) {
      const symbol = "C" + type.aliases[0];
      for (const n of notes) {
        expect(classes).toContain(Chord.classify(symbol, n));
        expect(classes).toContain(
          Chord.classify(symbol, n, { key: "C major" }),
        );
      }
    }
  });

  test("invalid input", () => {
    expect(Chord.classify("nonsense", "C")).toEqual("");
    expect(Chord.classify("maj7", "C")).toEqual("");
    expect(Chord.classify("Cmaj7", "nonsense")).toEqual("");
    expect(Chord.classify("Cmaj7", "D", { key: "C nonsense" })).toEqual("");
    expect(Chord.classify("Cmaj7", "D", { scale: "nonsense" })).toEqual("");
  });
});

describe("chordScales and chordScale", () => {
  test("without options, the catalogue order", () => {
    expect(Chord.chordScales("C7b9")).toEqual([
      "phrygian dominant",
      "flamenco",
      "phrygian b4",
      "mixolydian b2",
      "spanish heptatonic",
      "half-whole diminished",
      "chromatic",
    ]);
  });

  test("ranked in a key: the same scales", () => {
    const ranked = Chord.chordScales("D7", { key: "C major" });
    expect(ranked.slice(0, 3)).toEqual([
      "mixolydian",
      "lydian dominant",
      "mixolydian b6",
    ]);
    expect([...ranked].sort()).toEqual([...Chord.chordScales("D7")].sort());
  });

  test("chords outside the key", () => {
    const inC = (symbol: string) =>
      Chord.chordScale(symbol, { key: "C major" });
    expect(inC("D7")).toEqual("D mixolydian");
    expect(inC("C7")).toEqual("C mixolydian");
    expect(inC("A7")).toEqual("A mixolydian b6");
    expect(inC("E7")).toEqual("E phrygian dominant");
    expect(inC("B7")).toEqual("B phrygian dominant");
    expect(inC("Bb7")).toEqual("Bb lydian dominant");
    expect(inC("Bdim7")).toEqual("B diminished");
    expect(inC("C#dim7")).toEqual("C# diminished");
    expect(inC("Dm7b5")).toEqual("D locrian #2");
    expect(inC("F#m7b5")).toEqual("F# locrian");
    expect(inC("Fm6")).toEqual("F melodic minor");
    expect(inC("Fm7")).toEqual("F dorian");
    expect(inC("Gm7")).toEqual("G dorian");
    expect(inC("Abmaj7")).toEqual("Ab lydian");
    expect(inC("Ebmaj7")).toEqual("Eb lydian");
    expect(inC("G7alt")).toEqual("G altered");
    expect(inC("G7#11")).toEqual("G lydian dominant");
    expect(inC("G7#5")).toEqual("G whole tone");
    // by notes, not by function: the books give lydian dominant (ticket 19a)
    expect(inC("Db7")).toEqual("Db phrygian dominant");
  });

  test("without a key", () => {
    expect(Chord.chordScale("C7")).toEqual("C mixolydian");
    expect(Chord.chordScale("Cmaj7")).toEqual("C major");
    expect(Chord.chordScale("Cm7")).toEqual("C dorian");
    expect(Chord.chordScale("Cm7b5")).toEqual("C locrian");
    expect(Chord.chordScale("Cdim7")).toEqual("C diminished");
    expect(Chord.chordScale("CmMaj7")).toEqual("C melodic minor");
  });

  test("the tensions option changes which scales agree", () => {
    // lydian's #11 is another form of the 5th: without it as a tension, the
    // major scale comes first
    expect(Chord.chordScale("Ebmaj7", { key: "C major" })).toEqual("Eb lydian");
    expect(
      Chord.chordScale("Ebmaj7", { key: "C major", tensions: ["9", "13"] }),
    ).toEqual("Eb major");
  });

  test("invalid input", () => {
    expect(Chord.chordScales("nonsense", { key: "C major" })).toEqual([]);
    expect(Chord.chordScales("C7", { key: "nonsense" })).toEqual([]);
    expect(Chord.chordScales("7", { key: "C major" })).toEqual([]);
    expect(Chord.chordScale("nonsense")).toEqual("");
    expect(Chord.chordScale("C7", { key: "C nonsense" })).toEqual("");
  });
});
