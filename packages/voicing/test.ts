import { describe, expect, test } from "vitest";
import Chord from "@tonaljs/chord";
import ChordType from "@tonaljs/chord-type";
import Note from "@tonaljs/note";
import VoicingDictionary from "@tonaljs/voicing-dictionary";
import { topNoteDiff } from "@tonaljs/voice-leading";
import Voicing from "./index";

const { lefthand, triads } = VoicingDictionary;

describe("search", () => {
  test("C major triad inversions", () => {
    expect(Voicing.search("C", ["C3", "C5"], triads)).toEqual([
      ["C3", "E3", "G3"],
      ["C4", "E4", "G4"],
      ["E3", "G3", "C4"],
      ["E4", "G4", "C5"],
      ["G3", "C4", "E4"],
    ]);
  });
  // here, we override range and dictionary
  test("C^7 lefthand", () => {
    expect(Voicing.search("C^7", ["E3", "D5"], lefthand)).toEqual([
      ["E3", "G3", "B3", "D4"],
      ["E4", "G4", "B4", "D5"],
      ["B3", "D4", "E4", "G4"],
    ]);
  });
  // this shows that even symbols that are not part of chord-type could be used, as long as they are present in the dictionary
  test("Cminor7 lefthand", () => {
    expect(
      Voicing.search("Cminor7", ["Eb3", "D5"], {
        minor7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
      }),
    ).toEqual([
      ["Eb3", "G3", "Bb3", "D4"],
      ["Eb4", "G4", "Bb4", "D5"],
      ["Bb3", "D4", "Eb4", "G4"],
    ]);
  });
});

describe("get", () => {
  test("get", () => {
    // no options: the symbol's notes in root position, near the middle of C3-C5
    expect(Voicing.get("Dm7")).toEqual(["D3", "F3", "A3", "C4"]);
    // without lastVoicing
    expect(Voicing.get("Dm7", ["F3", "A4"], lefthand, topNoteDiff)).toEqual([
      "F3",
      "A3",
      "C4",
      "E4",
    ]);
    // with lastVoicing
    expect(
      Voicing.get("Dm7", ["F3", "A4"], lefthand, topNoteDiff, [
        "C4",
        "E4",
        "G4",
        "B4",
      ]),
    ).toEqual(["C4", "E4", "F4", "A4"]);
  });
});

test("sequence", () => {
  expect(
    Voicing.sequence(["C", "F", "G"], ["F3", "A4"], triads, topNoteDiff),
  ).toEqual([
    ["C4", "E4", "G4"], // root position
    ["A3", "C4", "F4"], // first inversion (F4 closest to G4)
    ["B3", "D4", "G4"], // first inversion (G4 closest to F4)
  ]);
});

describe("legacy dictionary voicings (a range array as second argument)", () => {
  const { all } = VoicingDictionary;

  test("search and get use the same default dictionary", () => {
    for (const symbol of Object.keys(all)) {
      const chord = "C" + symbol;
      const voicings = Voicing.search(chord, ["C3", "C5"]);
      expect(voicings).toEqual(Voicing.search(chord, ["C3", "C5"], all));
      expect(voicings.length).toBeGreaterThan(0);
      expect(Voicing.get(chord, ["C3", "C5"])).toEqual(voicings[0]);
    }
  });

  test("search without dictionary finds seventh chords", () => {
    expect(Voicing.search("Cmaj7", ["C3", "C5"])).toEqual([
      ["E3", "G3", "B3", "D4"],
      ["B3", "D4", "E4", "G4"],
    ]);
  });

  test("no voicing gives an empty array", () => {
    expect(Voicing.search("C13", ["C3", "C5"])).toEqual([]);
    expect(Voicing.get("C13", ["C3", "C5"])).toEqual([]);
    expect(
      Voicing.get("C13", undefined, undefined, topNoteDiff, ["C4", "E4", "G4"]),
    ).toEqual([]);
    expect(Voicing.get("nope", ["C3", "C5"])).toEqual([]);
    expect(Voicing.get("C", ["C3", "C5"], {})).toEqual([]);
    expect(Voicing.get("C", ["C4", "D4"])).toEqual([]);
  });
});

describe("sequence", () => {
  test("keeps an empty voicing for chords without one", () => {
    expect(Voicing.sequence(["C", "C13", "F"], ["F3", "A4"], triads)).toEqual([
      ["C4", "E4", "G4"],
      [],
      ["A3", "C4", "F4"], // voice-led from C, the last chord with a voicing
    ]);
  });

  test("all chords without voicing", () => {
    expect(Voicing.sequence(["C13", "nope"])).toEqual([[], []]);
    expect(Voicing.sequence([])).toEqual([]);
  });

  test("leading empty voicing", () => {
    expect(Voicing.sequence(["C13", "C"], ["F3", "A4"], triads)).toEqual([
      [],
      ["C4", "E4", "G4"], // same as the first chord of a sequence
    ]);
  });
});

describe("Voicing.get and search with options", () => {
  const pcs = (notes: string[]) =>
    [...new Set(notes.map((n) => Note.pitchClass(n)))].sort();
  const midis = (notes: string[]) => notes.map((n) => Note.midi(n) as number);

  test("by default, the notes of the symbol in root position", () => {
    expect(Voicing.get("C7")).toEqual(["C4", "E4", "G4", "Bb4"]);
    expect(Voicing.get("C")).toEqual(["C4", "E4", "G4"]);
    expect(Voicing.get("Co7")).toEqual(["C4", "Eb4", "Gb4", "Bbb4"]);
  });

  test("every chord type: the symbol's notes, spelled as the chord", () => {
    for (const type of ChordType.all()) {
      const symbol = "C" + type.aliases[0];
      const notes = Chord.get(symbol).notes;
      const voicing = Voicing.get(symbol);
      expect(voicing.length, symbol).toBe(notes.length);
      expect(pcs(voicing), symbol).toEqual([...notes].sort());
      expect(Note.pitchClass(voicing[0]), symbol).toBe("C");
    }
  });

  test("get is the first result of search", () => {
    for (const chord of ["C", "Dm7", "G7", "Cmaj7/E", "F#m7b5", "Bb13"]) {
      for (const options of [
        {},
        { voices: 3 },
        {
          voices: 4,
          extensions: "available" as const,
          bass: "external" as const,
        },
        { voices: 3, bass: "root" as const },
      ]) {
        expect(Voicing.get(chord, options)).toEqual(
          Voicing.search(chord, options)[0] ?? [],
        );
      }
    }
  });

  test("fewer voices keep the 3rd and 7th, and the tension that names the chord", () => {
    expect(pcs(Voicing.get("C7", { voices: 3 }))).toEqual(["Bb", "C", "E"]);
    expect(pcs(Voicing.get("C13", { voices: 4 }))).toEqual([
      "A",
      "Bb",
      "C",
      "E",
    ]);
    expect(pcs(Voicing.get("C13", { voices: 4, bass: "external" }))).toEqual([
      "A",
      "Bb",
      "D",
      "E",
    ]);
  });

  test("rootless voicings in a ii-V-I (3rd or 7th at the bottom)", () => {
    const options = {
      voices: 4,
      extensions: "available" as const,
      bass: "external" as const,
    };
    const ii = Voicing.get("Dm7", options);
    const V = Voicing.get("G7", { ...options, previous: ii });
    const I = Voicing.get("Cmaj7", { ...options, previous: V });
    expect([ii, V, I]).toEqual([
      ["F3", "A3", "C4", "E4"],
      ["F3", "A3", "B3", "E4"],
      ["E3", "G3", "B3", "D4"],
    ]);
  });

  test("a bass part", () => {
    const voicing = Voicing.get("C7", { bass: "root", voices: 3 });
    expect(voicing).toEqual(["C2", "Bb3", "E4", "G4"]);
    for (const v of Voicing.search("Dm7", { bass: "root" })) {
      expect(Note.pitchClass(v[0])).toBe("D");
      expect(Note.midi(v[0])).toBeLessThanOrEqual(Note.midi("C3") as number);
    }
  });

  test("a bass player: no root, except in m7b5 and dim7", () => {
    for (const v of Voicing.search("G7", { bass: "external" })) {
      expect(pcs(v)).not.toContain("G");
    }
    expect(Voicing.get("Cm7b5", { bass: "external", voices: 3 })).toEqual([
      "Bb3",
      "Eb4",
      "Gb4",
    ]);
  });

  test("slash chords have their bass at the bottom", () => {
    expect(Voicing.get("C/E")).toEqual(["E3", "G3", "C4"]);
    expect(Voicing.get("C7/E")).toEqual(["E3", "G3", "Bb3", "C4"]);
    expect(Note.pitchClass(Voicing.get("C/D")[0])).toBe("D");
  });

  test("explicit degrees: a plain number is the chord's own degree", () => {
    expect(pcs(Voicing.get("C7", { degrees: ["3", "7", "9"] }))).toEqual([
      "Bb",
      "D",
      "E",
    ]);
    expect(pcs(Voicing.get("Cm7", { degrees: ["3", "7"] }))).toEqual([
      "Bb",
      "Eb",
    ]);
  });

  test("a fixed top note, doubled below when there are voices left", () => {
    const voicing = Voicing.get("C6", { voices: 5, top: "A4" });
    expect(voicing[voicing.length - 1]).toBe("A4");
    expect(voicing.filter((n) => Note.pitchClass(n) === "A").length).toBe(2);
    const dm7 = Voicing.get("Dm7", {
      voices: 4,
      top: "C5",
      extensions: "available",
      bass: "external",
    });
    expect(dm7[dm7.length - 1]).toBe("C5");
  });

  test("a range for each voice", () => {
    const ranges: [string, string][] = [
      ["E2", "Bb4"],
      ["Ab2", "E5"],
      ["Db3", "Ab5"],
      ["F#3", "D6"],
    ];
    const voicing = Voicing.get("Dm7", {
      voices: ranges,
      extensions: "available",
      bass: "external",
    });
    expect(voicing.length).toBe(4);
    voicing.forEach((note, i) => {
      expect(Note.midi(note)).toBeGreaterThanOrEqual(Note.midi(ranges[i][0])!);
      expect(Note.midi(note)).toBeLessThanOrEqual(Note.midi(ranges[i][1])!);
    });
  });

  test("anchor modes", () => {
    const anchor = Note.midi("C5") as number;
    for (const v of Voicing.search("Cmaj7", { anchor: "C5", mode: "below" })) {
      expect(midis(v).at(-1)!).toBeLessThanOrEqual(anchor);
    }
    for (const v of Voicing.search("Cmaj7", { anchor: "C5", mode: "duck" })) {
      expect(midis(v).at(-1)!).toBeLessThan(anchor);
      expect(midis(v)).not.toContain(anchor);
    }
    const above = Voicing.search("Cmaj7", {
      anchor: "C4",
      mode: "above",
      range: ["C3", "C6"],
    });
    for (const v of above) {
      expect(midis(v)[0]).toBeGreaterThanOrEqual(Note.midi("C4")!);
    }
    for (const v of Voicing.search("Cmaj7", {
      anchor: "C3",
      mode: "root",
      range: ["C3", "C6"],
    })) {
      expect(Note.pitchClass(v[0])).toBe("C");
    }
  });

  test("low interval limits", () => {
    const low = Voicing.search("C", { range: ["C2", "B2"] });
    expect(low).not.toContainEqual(["C2", "E2", "G2"]);
    expect(
      Voicing.search("C", { range: ["C2", "B2"], lowIntervals: false }),
    ).toContainEqual(["C2", "E2", "G2"]);
  });

  test("invalid input gives []", () => {
    expect(Voicing.get("xx")).toEqual([]);
    expect(Voicing.get("")).toEqual([]);
    expect(Voicing.get("maj7")).toEqual([]);
    expect(Voicing.get("C", { voices: 0 })).toEqual([]);
    expect(Voicing.get("C", { range: ["x", "y"] })).toEqual([]);
    expect(Voicing.search("C", { range: ["C4", "D4"] })).toEqual([]);
  });
});
