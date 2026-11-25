import { describe, expect, test } from "vitest";
import * as VoiceLeading from "@tonaljs/voice-leading";
import Chord from "@tonaljs/chord";
import ChordType from "@tonaljs/chord-type";
import Note from "@tonaljs/note";
import VoicingDictionary from "@tonaljs/voicing-dictionary";
import { topNoteDiff } from "@tonaljs/voice-leading";
import * as Voicing from "./index";

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
    expect(Voicing.sequence(["C13", "nope"], ["C3", "C5"])).toEqual([[], []]);
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

describe("Voicing.sequence with options", () => {
  const jazz = {
    voices: 4,
    extensions: "available" as const,
    bass: "external" as const,
  };

  test("pop progression: root position first, then the smoothest inversions", () => {
    expect(Voicing.sequence(["C", "Am", "F", "G"])).toEqual([
      ["C4", "E4", "G4"],
      ["C4", "E4", "A4"],
      ["C4", "F4", "A4"],
      ["B3", "D4", "G4"],
    ]);
  });

  test("rootless ii-V-I", () => {
    expect(Voicing.sequence(["Dm7", "G7", "Cmaj7"], jazz)).toEqual([
      ["F3", "A3", "C4", "E4"],
      ["F3", "A3", "B3", "E4"],
      ["E3", "G3", "B3", "D4"],
    ]);
  });

  test("a bass part with three voices (shell + one tension)", () => {
    expect(
      Voicing.sequence(["Dm7", "G7", "Cmaj7"], {
        voices: 3,
        bass: "root",
        extensions: "available",
      }),
    ).toEqual([
      ["D2", "F3", "C4", "E4"],
      ["G2", "F3", "B3", "E4"],
      ["C3", "E3", "B3", "D4"],
    ]);
  });

  test("every voicing is one of the chord's voicings with the same options", () => {
    const chords = ["Cmaj7", "Am7", "Dm7", "G7", "Em7", "A7", "Dm7", "G7"];
    for (const options of [
      {},
      jazz,
      { voices: 3 },
      { bass: "root" as const },
    ]) {
      const result = Voicing.sequence(chords, options);
      result.forEach((voicing, i) => {
        expect(Voicing.search(chords[i], options)).toContainEqual(voicing);
      });
    }
  });

  test("each chord can have its own options", () => {
    const result = Voicing.sequence(
      ["Dm7", { chord: "G7", voices: 5 }, "Cmaj7"],
      { voices: 4 },
    );
    expect(result.map((v) => v.length)).toEqual([4, 5, 4]);
  });

  test("previous", () => {
    const result = Voicing.sequence(["G7", "Cmaj7"], {
      ...jazz,
      previous: ["F3", "A3", "C4", "E4"],
    });
    expect(result[0]).toEqual(["F3", "A3", "B3", "E4"]);
  });

  test("maxLeap", () => {
    const result = Voicing.sequence(["C", "F", "G", "C"], { maxLeap: 2 });
    for (let i = 1; i < result.length; i++) {
      const { moves } = VoiceLeading.get(result[i - 1], result[i]);
      for (const [from, to] of moves) {
        expect(Math.abs(Note.midi(to)! - Note.midi(from)!)).toBeLessThanOrEqual(
          2,
        );
      }
    }
  });

  test("chords without voicings keep their place", () => {
    expect(Voicing.sequence(["C", "xx", "F"])).toEqual([
      ["C4", "E4", "G4"],
      [],
      ["C4", "F4", "A4"],
    ]);
    expect(Voicing.sequence([])).toEqual([]);
  });
});

describe("spacing", () => {
  test("named spacings", () => {
    expect(Voicing.get("Cmaj7", { spacing: "close" })).toEqual([
      "C4",
      "E4",
      "G4",
      "B4",
    ]);
    expect(Voicing.get("C", { spacing: "open" })).toEqual(["C3", "G3", "E4"]);
    expect(Voicing.get("Cmaj7", { spacing: "drop2" })).toEqual([
      "C3",
      "G3",
      "B3",
      "E4",
    ]);
    expect(Voicing.get("Cmaj7", { spacing: "drop3" })).toEqual([
      "C3",
      "B3",
      "E4",
      "G4",
    ]);
    expect(Voicing.get("Cmaj7", { spacing: "drop24" })).toEqual([
      "C3",
      "G3",
      "E4",
      "B4",
    ]);
    expect(
      Voicing.get("C6", { spacing: "block", voices: 5, top: "A4" }),
    ).toEqual(["A3", "C4", "E4", "G4", "A4"]);
    expect(Voicing.get("Dm7", { spacing: [2, 1, 2] })).toEqual([
      "D3",
      "A3",
      "C4",
      "F4",
    ]);
  });

  test("every voicing of a spacing has it", () => {
    const names = ["close", "open", "drop2", "drop3", "drop24"] as const;
    for (const chord of ["Cmaj7", "Dm7", "G7", "F#m7b5", "Bb6"]) {
      for (const spacing of names) {
        for (const v of Voicing.search(chord, {
          spacing,
          range: ["C3", "C6"],
        })) {
          const analysis = Voicing.analyze(v, chord);
          if (spacing === "close")
            expect(analysis.steps.every((s) => s === 1)).toBe(true);
          if (spacing === "drop2") {
            // undo the drop: the lowest voice up an octave gives a close voicing
            const up = Voicing.analyze([
              Note.transpose(v[0], "8P"),
              ...v.slice(1),
            ]);
            expect(up.steps.every((s) => s === 1)).toBe(true);
          }
        }
      }
    }
  });

  test("spread: the root at the bottom, wide at the bottom", () => {
    const v = Voicing.get("Cmaj7", {
      spacing: "spread",
      voices: 5,
      extensions: "available",
      range: ["C3", "D5"],
    });
    expect(v).toEqual(["C3", "G3", "B3", "D4", "E4"]);
    // also a drop 3 of five voices, the name analyze gives first
    expect(Voicing.analyze(v, "Cmaj7").spacing).toBe("drop3");
    for (const w of Voicing.search("Cmaj7", {
      spacing: "spread",
      voices: 5,
      extensions: "available",
      range: ["C3", "D5"],
    })) {
      expect(Note.pitchClass(w[0])).toBe("C");
      expect(Note.midi(w[w.length - 1])! - Note.midi(w[0])!).toBeGreaterThan(
        12,
      );
    }
  });
});

describe("Voicing.analyze", () => {
  test("describes a voicing", () => {
    expect(Voicing.analyze(["G3", "C4", "E4", "B4"], "Cmaj7")).toEqual({
      empty: false,
      notes: ["G3", "C4", "E4", "B4"],
      bass: "G3",
      top: "B4",
      span: "10M",
      steps: [2, 1, 2],
      spacing: "drop2",
      degrees: ["5", "1", "3", "7"],
    });
  });

  test("names", () => {
    expect(Voicing.analyze(["E4", "C4", "G4"]).notes).toEqual([
      "C4",
      "E4",
      "G4",
    ]);
    expect(Voicing.analyze(["C4", "E4", "G4"]).spacing).toBe("close");
    expect(Voicing.analyze(["C4", "G4", "E5"]).spacing).toBe("open");
    expect(Voicing.analyze(["E3", "C4", "G4", "B4"]).spacing).toBe("drop3");
    expect(Voicing.analyze(["C3", "G3", "E4", "B4"]).spacing).toBe("drop24");
    expect(Voicing.analyze(["A3", "C4", "E4", "G4", "A4"]).spacing).toBe(
      "block",
    );
    expect(
      Voicing.analyze(["C3", "B3", "E4", "A4", "D5"], "Cmaj7").spacing,
    ).toBe("spread");
  });

  test("invalid", () => {
    expect(Voicing.analyze([]).empty).toBe(true);
    expect(Voicing.analyze(["C", "E"]).empty).toBe(true);
  });
});

describe("Voicing.invert and drop", () => {
  test("invert moves every voice along the voicing's notes", () => {
    expect(Voicing.invert(["C4", "E4", "G4"], 1)).toEqual(["E4", "G4", "C5"]);
    expect(Voicing.invert(["C4", "E4", "G4"], -1)).toEqual(["G3", "C4", "E4"]);
    expect(Voicing.invert(["C4", "G4", "E5"], 1)).toEqual(["E4", "C5", "G5"]);
    expect(Voicing.invert(["C#4", "E#4", "G#4", "B4"], 1)).toEqual([
      "E#4",
      "G#4",
      "B4",
      "C#5",
    ]);
    expect(Voicing.invert(["C4", "E4"], 0)).toEqual(["C4", "E4"]);
    expect(Voicing.invert(["C"], 1)).toEqual([]);
  });

  test("laws: invert keeps the spacing and goes back", () => {
    const voicings = [
      ["C4", "E4", "G4"],
      ["G3", "C4", "E4", "B4"],
      ["D3", "A3", "C4", "F4", "E5"],
    ];
    for (const v of voicings) {
      for (const n of [1, 2, 3, -1, -2]) {
        const inverted = Voicing.invert(v, n);
        expect(Voicing.analyze(inverted).steps).toEqual(
          Voicing.analyze(v).steps,
        );
        expect(Voicing.invert(inverted, -n)).toEqual(v);
      }
    }
  });

  test("drop lowers voices counted from the top", () => {
    const close = ["C4", "E4", "G4", "B4"];
    expect(Voicing.drop(close, 2)).toEqual(["G3", "C4", "E4", "B4"]);
    expect(Voicing.drop(close, 3)).toEqual(["E3", "C4", "G4", "B4"]);
    expect(Voicing.drop(close, [2, 4])).toEqual(["C3", "G3", "E4", "B4"]);
    expect(Voicing.drop(close, 5)).toEqual([]);
    expect(Voicing.drop(["C"], 1)).toEqual([]);
  });

  test("laws: drop keeps the pitch classes, and names its spacing", () => {
    const close = ["D4", "F4", "A4", "C5"];
    const pcs = (v: string[]) => v.map(Note.pitchClass).sort();
    expect(pcs(Voicing.drop(close, 2))).toEqual(pcs(close));
    expect(Voicing.analyze(Voicing.drop(close, 2)).spacing).toBe("drop2");
    expect(Voicing.analyze(Voicing.drop(close, 3)).spacing).toBe("drop3");
    expect(Voicing.analyze(Voicing.drop(close, [2, 4])).spacing).toBe("drop24");
  });
});

describe("templates", () => {
  const pcs = (v: string[]) => v.map((n) => Note.pitchClass(n));

  test("the catalogue", () => {
    expect(Voicing.templates()).toEqual(
      expect.arrayContaining([
        "shell",
        "guide-tones",
        "rootless",
        "rootless-spread",
        "so-what",
        "fourths",
        "upper-structure",
        "triad-over-root",
      ]),
    );
  });

  test("rootless: 3rd or 7th at the bottom, by family", () => {
    expect(Voicing.get("Dm7", { template: "rootless" })).toEqual([
      "F3",
      "A3",
      "C4",
      "E4",
    ]);
    expect(pcs(Voicing.get("C6", { template: "rootless" }))).toEqual([
      "A",
      "D",
      "E",
      "G",
    ]);
    expect(pcs(Voicing.get("Cm7b5", { template: "rootless" }))).toEqual([
      "Bb",
      "C",
      "Eb",
      "Gb",
    ]);
    expect(
      Voicing.search("G7", { template: "rootless", voices: 3 }).map(pcs),
    ).toEqual(
      expect.arrayContaining([
        ["F", "B", "E"],
        ["B", "F", "A"],
      ]),
    );
    // a triad has no 7th: the template doesn't apply, and the rules voice it
    expect(Voicing.get("C", { template: "rootless" })).toEqual(
      Voicing.get("C"),
    );
  });

  test("the ii-V-I with a template", () => {
    expect(
      Voicing.sequence(["Dm7", "G7", "Cmaj7"], { template: "rootless" }),
    ).toEqual([
      ["F3", "A3", "C4", "E4"],
      ["F3", "A3", "B3", "E4"],
      ["E3", "G3", "B3", "D4"],
    ]);
  });

  test("so what, fourths, shells, guide tones", () => {
    expect(Voicing.get("Dm7", { template: "so-what" })).toEqual([
      "D3",
      "G3",
      "C4",
      "F4",
      "A4",
    ]);
    expect(Voicing.get("C6/9", { template: "fourths" })).toEqual([
      "E3",
      "A3",
      "D4",
      "G4",
      "C5",
    ]);
    expect(pcs(Voicing.get("C7", { template: "shell" }))).toEqual([
      "C",
      "E",
      "Bb",
    ]);
    expect(
      Voicing.search("Cmaj7", { template: "guide-tones", range: ["C2", "C5"] }),
    ).toContainEqual(["C3", "B3", "E4"]);
  });

  test("upper structures only on dominants", () => {
    const v = Voicing.get("C7", {
      template: "upper-structure-bVI",
      range: ["C3", "C6"],
    });
    expect(pcs(v).slice(0, 3)).toEqual(["C", "E", "Bb"]);
    expect([...pcs(v).slice(3)].sort()).toEqual(["Ab", "C", "D#"]);
    // not a dominant: the rules voice it
    expect(Voicing.get("Cmaj7", { template: "upper-structure" })).toEqual(
      Voicing.get("Cmaj7"),
    );
  });

  test("custom templates: degrees, with | between the hands", () => {
    expect(
      Voicing.get("Dm7", { template: "R | 3-7-9", range: ["C2", "C5"] }),
    ).toEqual(["D3", "F3", "C4", "E4"]);
    expect(
      Voicing.get("Dm7", { template: ["3-5-7-9"], range: ["C3", "C5"] }),
    ).toEqual(["F3", "A3", "C4", "E4"]);
  });

  test("every template note is the nearest above the one below (one hand)", () => {
    for (const chord of ["Cmaj7", "Dm7", "G7", "Bbm7b5", "Ebo7", "F7sus4"]) {
      for (const v of Voicing.search(chord, { template: "rootless" })) {
        const midis = v.map((n) => Note.midi(n)!);
        for (let i = 1; i < midis.length; i++) {
          expect(midis[i] - midis[i - 1]).toBeLessThan(12);
        }
      }
    }
  });

  test("unknown templates give []", () => {
    expect(Voicing.get("C7", { template: "nope" })).toEqual([]);
  });
});

describe("templates fall back to the rules", () => {
  test("a chord the template has no form for is voiced by the rules", () => {
    expect(Voicing.get("G7", { template: "so-what" })).toEqual(
      Voicing.get("G7"),
    );
    expect(Voicing.get("C", { template: "rootless" })).toEqual(
      Voicing.get("C"),
    );
    const result = Voicing.sequence(["Dm7", "G7", "Cmaj7"], {
      template: "so-what",
      range: ["C3", "C6"],
    });
    expect(result.every((v) => v.length > 0)).toBe(true);
    // the minor chord is a So What voicing (three 4ths and a 3rd on D)
    expect(result[0].map((n) => Note.pitchClass(n))).toEqual([
      "D",
      "G",
      "C",
      "F",
      "A",
    ]);
  });
});

describe("doubling: the root or the 5th", () => {
  test("a triad in four voices can double the 5th", () => {
    const voicings = Voicing.search("D", { voices: 4 });
    const fifths = (v: string[]) =>
      v.filter((n) => Note.pitchClass(n) === "A").length;
    expect(voicings.some((v) => fifths(v) === 2)).toBe(true);
    // drop 2 in C3-C5 needs the 5th doubled: F#3 A3 D4 A4
    expect(Voicing.search("D", { voices: 4, spacing: "drop2" })).toContainEqual(
      ["F#3", "A3", "D4", "A4"],
    );
  });

  test("the 3rd is never doubled to fill voices", () => {
    for (const v of Voicing.search("C", { voices: 5, range: ["C3", "C6"] })) {
      expect(v.filter((n) => Note.pitchClass(n) === "E").length).toBe(1);
    }
  });
});
