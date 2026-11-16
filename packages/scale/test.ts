import { describe, expect, test } from "vitest";
import { all as scaleTypes } from "@tonaljs/scale-type";
import { note } from "@tonaljs/pitch-note";
import * as Scale from "./index";

const $ = (s: string) => s.split(" ");

describe("@tonaljs/scale", () => {
  test("get", () => {
    expect(Scale.get("major")).toEqual({
      empty: false,
      tonic: "",
      notes: [],
      type: "major",
      name: "major",
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      aliases: ["ionian"],
      setNum: 2773,
      chroma: "101011010101",
      normalized: "101010110101",
    });
    expect(Scale.get("c5 pentatonic")).toEqual({
      empty: false,
      name: "C5 major pentatonic",
      type: "major pentatonic",
      tonic: "C5",
      notes: ["C5", "D5", "E5", "G5", "A5"],
      intervals: ["1P", "2M", "3M", "5P", "6M"],
      aliases: ["pentatonic"],
      setNum: 2708,
      chroma: "101010010100",
      normalized: "100101001010",
    });
    expect(Scale.get("C4 major")).toEqual(Scale.get(["C4", "major"]));
    expect(Scale.get("C4 Major")).toEqual(Scale.get("C4 major"));
  });

  test("tokenize", () => {
    expect(Scale.tokenize("c major")).toEqual(["C", "major"]);
    expect(Scale.tokenize("cb3 major")).toEqual(["Cb3", "major"]);
    expect(Scale.tokenize("melodic minor")).toEqual(["", "melodic minor"]);
    expect(Scale.tokenize("dorian")).toEqual(["", "dorian"]);
    expect(Scale.tokenize("c")).toEqual(["C", ""]);
    expect(Scale.tokenize("")).toEqual(["", ""]);
  });
  test("isKnown", () => {
    expect(Scale.get("major").empty).toBe(false);
    expect(Scale.get("Db major").empty).toBe(false);
    expect(Scale.get("hello").empty).toBe(true);
    expect(Scale.get("").empty).toBe(true);
    expect(Scale.get("Maj7").empty).toBe(true);
  });

  test("Scale.get with mixed cases", () => {
    expect(Scale.get("C lydian #5P pentatonic")).toEqual(
      Scale.get("C lydian #5p pentatonic"),
    );
    expect(Scale.get("lydian #5p PENTATONIC")).toEqual(
      Scale.get("lydian #5P pentatonic"),
    );
  });

  // Regression test for https://github.com/tonaljs/tonal/issues/482
  test("Scale.get works with scales containing interval qualifiers in name (#482)", () => {
    // These scales have interval qualifiers (#5p, #7m) in their names
    const lydian5p = Scale.get("C lydian #5p pentatonic");
    expect(lydian5p.empty).toBe(false);
    expect(lydian5p.name).toBe("C lydian #5p pentatonic");
    expect(lydian5p.notes).toEqual(["C", "E", "F#", "G#", "B"]);

    const minor7m = Scale.get("C minor #7m pentatonic");
    expect(minor7m.empty).toBe(false);
    expect(minor7m.name).toBe("C minor #7m pentatonic");
    expect(minor7m.notes).toEqual(["C", "Eb", "F", "G", "B"]);
  });

  test("intervals", () => {
    expect(Scale.get("major").intervals).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(Scale.get("C major").intervals).toEqual($("1P 2M 3M 4P 5P 6M 7M"));
    expect(Scale.get("blah").intervals).toEqual([]);
  });

  test("notes", () => {
    expect(Scale.get("C major").notes).toEqual($("C D E F G A B"));
    expect(Scale.get("C lydian #9").notes).toEqual($("C D# E F# G A B"));
    expect(Scale.get(["C", "major"]).notes).toEqual($("C D E F G A B"));
    expect(Scale.get(["C4", "major"]).notes).toEqual($("C4 D4 E4 F4 G4 A4 B4"));
    expect(Scale.get(["eb", "bebop"]).notes).toEqual($("Eb F G Ab Bb C Db D"));
    expect(Scale.get(["C", "no-scale"]).notes).toEqual([]);
    expect(Scale.get(["no-note", "major"]).notes).toEqual([]);
  });

  describe("Scale.detect", () => {
    test("detect exact match", () => {
      expect(
        Scale.detect(["D", "E", "F#", "A", "B"], { match: "exact" }),
      ).toEqual(["D major pentatonic"]);
      expect(
        Scale.detect(["D", "E", "F#", "A", "B"], {
          match: "exact",
          tonic: "B",
        }),
      ).toEqual(["B minor pentatonic"]);
      expect(
        Scale.detect(["D", "F#", "B", "C", "C#"], { match: "exact" }),
      ).toEqual([]);
      expect(
        Scale.detect(["c", "d", "e", "f", "g", "a", "b"], { match: "exact" }),
      ).toEqual(["C major"]);
      expect(
        Scale.detect(["c2", "d6", "e3", "f1", "g7", "a6", "b5"], {
          match: "exact",
          tonic: "d",
        }),
      ).toEqual(["D dorian"]);
    });

    test("detect fit match", () => {
      expect(
        Scale.detect(["C", "D", "E", "F", "G", "A", "B"], { match: "fit" }),
      ).toEqual([
        "C major",
        "C bebop",
        "C bebop major",
        "C ichikosucho",
        "C chromatic",
      ]);
      expect(
        Scale.detect(["D", "F#", "B", "C", "C#"], { match: "fit" }),
      ).toEqual(["D bebop", "D kafi raga", "D chromatic"]);
      expect(Scale.detect(["Ab", "Bb", "C", "Db", "Eb", "G"])).toEqual([
        "Ab major",
        "Ab bebop",
        "Ab harmonic major",
        "Ab bebop major",
        "Ab ichikosucho",
        "Ab chromatic",
      ]);
    });

    test("tonic will be added", () => {
      expect(
        Scale.detect(["c", "d", "e", "f", "g", "b"], { match: "exact" }),
      ).toEqual([]);
      expect(
        Scale.detect(["c", "d", "e", "f", "g", "b"], {
          match: "exact",
          tonic: "a",
        }),
      ).toEqual(["A minor"]);
    });
  });

  test("Ukrainian Dorian scale", () => {
    // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
    expect(Scale.get("C romanian minor").notes).toEqual($("C D Eb F# G A Bb"));
    expect(Scale.get("C ukrainian dorian").notes).toEqual(
      $("C D Eb F# G A Bb"),
    );
    expect(Scale.get("B romanian minor").notes).toEqual($("B C# D E# F# G# A"));
    expect(Scale.get("B dorian #4").notes).toEqual($("B C# D E# F# G# A"));
    expect(Scale.get("B altered dorian").notes).toEqual($("B C# D E# F# G# A"));
  });

  test("chords: find all chords that fits into this scale", () => {
    expect(Scale.scaleChords("pentatonic")).toEqual($("5 M 6 sus2 Madd9"));
    expect(Scale.scaleChords("none")).toEqual([]);
  });

  test("extended: find all scales that extends this one", () => {
    expect(Scale.extended("major")).toEqual([
      "bebop",
      "bebop major",
      "ichikosucho",
      "chromatic",
    ]);
    expect(Scale.extended("none")).toEqual([]);
  });

  test("Scale.reduced: all scales that are included in the given one", () => {
    expect(Scale.reduced("major")).toEqual([
      "major pentatonic",
      "ionian pentatonic",
      "ritusen",
    ]);
    expect(Scale.reduced("D major")).toEqual(Scale.reduced("major"));
    expect(Scale.reduced("none")).toEqual([]);
  });

  describe("specific and problematic scales", () => {
    test("whole note scale should use 6th", () => {
      expect(Scale.get("C whole tone").notes.join(" ")).toEqual(
        "C D E F# G# A#",
      );
      expect(Scale.get("Db whole tone").notes.join(" ")).toEqual(
        "Db Eb F G A B",
      );
    });
  });

  test("scaleNotes", () => {
    expect(Scale.scaleNotes($("C4 c3 C5 C4 c4"))).toEqual(["C"]);
    expect(Scale.scaleNotes($("C4 f3 c#10 b5 d4 cb4"))).toEqual(
      $("C C# D F B Cb"),
    );
    expect(Scale.scaleNotes($("D4 c#5 A5 F#6"))).toEqual([
      "D",
      "F#",
      "A",
      "C#",
    ]);
    expect(Scale.scaleNotes($("C4 B#3 C5 E4"))).toEqual($("C B# E"));
  });

  test("mode names", () => {
    expect(Scale.modeNames("pentatonic")).toEqual([
      ["1P", "major pentatonic"],
      ["2M", "egyptian"],
      ["3M", "malkos raga"],
      ["5P", "ritusen"],
      ["6M", "minor pentatonic"],
    ]);
    expect(Scale.modeNames("whole tone pentatonic")).toEqual([
      ["1P", "whole tone pentatonic"],
    ]);
    expect(Scale.modeNames("C pentatonic")).toEqual([
      ["C", "major pentatonic"],
      ["D", "egyptian"],
      ["E", "malkos raga"],
      ["G", "ritusen"],
      ["A", "minor pentatonic"],
    ]);
    expect(Scale.modeNames("C whole tone pentatonic")).toEqual([
      ["C", "whole tone pentatonic"],
    ]);
  });

  describe("rangeOf", () => {
    test("range of a scale name", () => {
      const range = Scale.rangeOf("C pentatonic");
      expect(range("C4", "C5").join(" ")).toEqual("C4 D4 E4 G4 A4 C5");
      expect(range("C5", "C4").join(" ")).toEqual("C5 A4 G4 E4 D4 C4");
      expect(range("g3", "a2").join(" ")).toEqual("G3 E3 D3 C3 A2");
    });

    test("range of a scale name with flat", () => {
      const range = Scale.rangeOf("Cb major");
      expect(range("Cb4", "Cb5").join(" ")).toEqual(
        "Cb4 Db4 Eb4 Fb4 Gb4 Ab4 Bb4 Cb5",
      );
    });

    test("range of a scale name with sharp", () => {
      const range = Scale.rangeOf("C# major");
      expect(range("C#4", "C#5").join(" ")).toEqual(
        "C#4 D#4 E#4 F#4 G#4 A#4 B#4 C#5",
      );
    });

    test("range of a scale without tonic", () => {
      const range = Scale.rangeOf("pentatonic");
      expect(range("C4", "C5")).toEqual([]);
    });

    test("range of a list of notes", () => {
      const range = Scale.rangeOf(["c4", "g4", "db3", "g"]);
      expect(range("c4", "c5").join(" ")).toEqual("C4 Db4 G4 C5");
    });

    describe("degrees", () => {
      test("positive scale degrees", () => {
        expect(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            .map(Scale.degrees("C major"))
            .join(" "),
        ).toEqual("C D E F G A B C D E");
        expect(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            .map(Scale.degrees("C4 major"))
            .join(" "),
        ).toEqual("C4 D4 E4 F4 G4 A4 B4 C5 D5 E5");
        expect(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            .map(Scale.degrees("C4 pentatonic"))
            .join(" "),
        ).toEqual("C4 D4 E4 G4 A4 C5 D5 E5 G5 A5 C6");
      });
      test("invalid inputs", () => {
        expect(Scale.degrees("C major")(0)).toBe("");
        expect(Scale.degrees("C nonsense")(0)).toBe("");
      });
    });

    test("negative scale degrees", () => {
      expect(
        [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
          .map(Scale.degrees("C major"))
          .join(" "),
      ).toEqual("B A G F E D C B A G");
      expect(
        [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
          .map(Scale.degrees("C4 major"))
          .join(" "),
      ).toEqual("B3 A3 G3 F3 E3 D3 C3 B2 A2 G2");
      expect(
        [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11]
          .map(Scale.degrees("C4 pentatonic"))
          .join(" "),
      ).toEqual("A3 G3 E3 D3 C3 A2 G2 E2 D2 C2 A1");
    });
  });

  describe("altered degrees and steps", () => {
    test("degrees with accidentals", () => {
      const cMajor = Scale.degrees("C major");
      expect(["7b", "4#", "3b", "7bb", "1##", "7"].map(cMajor)).toEqual(
        $("Bb F# Eb Bbb C## B"),
      );
      expect(Scale.degrees("C4 major")("7b")).toBe("Bb4");
      expect(Scale.degrees("C4 major")("11#")).toBe("F#5");
      expect(Scale.degrees("C4 major")("-2b")).toBe("Ab3");
      expect(Scale.degrees("C4 major")("-1")).toBe("B3");
    });
    test("keeps the letter of the degree", () => {
      expect(Scale.degrees("A major")("7b")).toBe("G");
      expect(Scale.degrees("Eb major")("4#")).toBe("A");
      expect(Scale.degrees("F# major")("3b")).toBe("A");
      expect(Scale.degrees("D dorian")("3#")).toBe("F#");
    });
    test("steps with accidentals", () => {
      const steps = Scale.steps("C4 major");
      expect(["6b", "3#", "0", "-1b", "7b"].map(steps)).toEqual(
        $("Bb4 F#4 C4 Bb3 Cb5"),
      );
    });
    test("invalid degrees and steps", () => {
      const degrees = Scale.degrees("C major");
      const steps = Scale.steps("C major");
      for (const invalid of [
        "",
        "b",
        "b7",
        "#4",
        "-b2",
        "7x",
        "1.5",
        "2#b",
        "7 b",
      ]) {
        expect(degrees(invalid)).toBe("");
        expect(steps(invalid)).toBe("");
      }
      expect(degrees("0b")).toBe("");
      expect(degrees(1.5)).toBe("");
      expect(steps(1.5)).toBe("");
      expect(Scale.degrees("major")("7b")).toBe("");
      expect(Scale.steps("major")(1)).toBe("");
    });
  });

  describe("transposeBySteps", () => {
    test("by scale steps", () => {
      expect(Scale.transposeBySteps("C major", "E4", 2)).toBe("G4");
      expect(Scale.transposeBySteps("C major", "E4", -3)).toBe("B3");
      expect(Scale.transposeBySteps("C major", "E4", 0)).toBe("E4");
      expect(Scale.transposeBySteps("C major", "B3", 1)).toBe("C4");
      expect(Scale.transposeBySteps("C major", "C4", -1)).toBe("B3");
      expect(Scale.transposeBySteps("C major", "E4", 14)).toBe("E6");
      expect(Scale.transposeBySteps("C4 major", "E2", 2)).toBe("G2");
      expect(Scale.transposeBySteps("D dorian", "C5", 3)).toBe("F5");
      expect(Scale.transposeBySteps("C minor pentatonic", "Bb3", 2)).toBe(
        "Eb4",
      );
      expect(Scale.transposeBySteps("C bebop", "A4", 2)).toBe("B4");
    });
    test("pitch classes", () => {
      expect(Scale.transposeBySteps("C major", "E", 2)).toBe("G");
      expect(Scale.transposeBySteps("C4 major", "B", 1)).toBe("C");
      expect(Scale.transposeBySteps("Gb major", "Cb", -1)).toBe("Bb");
    });
    test("spelled as in the scale", () => {
      expect(Scale.transposeBySteps("C major", "B#3", 1)).toBe("D4");
      expect(Scale.transposeBySteps("C major", "Fb4", 0)).toBe("E4");
      expect(Scale.transposeBySteps("Cb major", "B3", 1)).toBe("Db4");
      expect(Scale.transposeBySteps("Cb major", "Bb4", 1)).toBe("Cb5");
      expect(Scale.transposeBySteps("C# major", "B#3", 1)).toBe("C#4");
    });
    test("notes outside the scale and invalid input", () => {
      expect(Scale.transposeBySteps("C major", "F#4", 1)).toBe("");
      expect(Scale.transposeBySteps("C major", "F#", 1)).toBe("");
      expect(Scale.transposeBySteps("major", "E4", 1)).toBe("");
      expect(Scale.transposeBySteps("C nonsense", "E4", 1)).toBe("");
      expect(Scale.transposeBySteps("C major", "blah", 1)).toBe("");
      expect(Scale.transposeBySteps("C major", "E4", 1.5)).toBe("");
      expect(Scale.transposeBySteps("C major", "E4", NaN)).toBe("");
    });
  });

  describe("nearest", () => {
    test("nearest scale note", () => {
      expect(Scale.nearest("C major", "F#4")).toBe("G4");
      expect(Scale.nearest("C major", "Gb4")).toBe("G4");
      expect(Scale.nearest("C major", "C#4")).toBe("D4");
      expect(Scale.nearest("C major", "E4")).toBe("E4");
      expect(Scale.nearest("C major", "B#3")).toBe("C4");
      expect(Scale.nearest("C major", "Cb4")).toBe("B3");
      expect(Scale.nearest("C minor pentatonic", "D4")).toBe("Eb4");
      expect(Scale.nearest("C minor pentatonic", "A4")).toBe("Bb4");
      expect(Scale.nearest("C minor pentatonic", "Ab4")).toBe("G4");
      expect(Scale.nearest("C major pentatonic", "B3")).toBe("C4");
      expect(Scale.nearest("C4 major", "F#1")).toBe("G1");
    });
    test("pitch classes", () => {
      expect(Scale.nearest("C major", "Eb")).toBe("E");
      expect(Scale.nearest("C major", "B")).toBe("B");
      expect(Scale.nearest("Cb major", "C")).toBe("Db");
      expect(Scale.nearest("C4 major", "F#")).toBe("G");
    });
    test("invalid input", () => {
      expect(Scale.nearest("major", "E4")).toBe("");
      expect(Scale.nearest("C nonsense", "E4")).toBe("");
      expect(Scale.nearest("C major", "blah")).toBe("");
    });
  });

  describe("laws for every scale type and tonic", () => {
    const tonics = "CDEFGAB".split("").flatMap((l) => [l + "b", l, l + "#"]);
    const height = (n: string) => note(n).height;
    const midis = Array.from({ length: 15 }, (_, i) => 59 + i);
    const spellings = midis.map(enharmonics);

    test.each(scaleTypes().map((t) => t.name))("%s", (type) => {
      for (const tonic of tonics) {
        const scale = tonic + " " + type;
        const steps = Scale.steps(tonic + "4 " + type);
        const len = Scale.get(scale).intervals.length;
        for (let i = -len; i < len; i++) {
          const n = steps(i);
          expect(Scale.nearest(scale, n)).toBe(n);
          expect(Scale.transposeBySteps(scale, n, len)).toBe(steps(i + len));
          expect(height(steps(i + len))).toBe(height(n) + 12);
          for (const by of [-len - 1, -1, 2]) {
            const moved = Scale.transposeBySteps(scale, n, by);
            expect(moved).toBe(steps(i + by));
            expect(Scale.transposeBySteps(scale, moved, -by)).toBe(n);
          }
        }
        // every note goes to a scale note at the smallest distance, and
        // enharmonic spellings go to the same scale note
        midis.forEach((midi, m) => {
          const candidates = Array.from({ length: 5 * len }, (_, k) =>
            height(steps(k - 2 * len)),
          );
          const best = Math.min(...candidates.map((h) => Math.abs(h - midi)));
          const near = spellings[m].map((n) => Scale.nearest(scale, n));
          expect(Math.abs(height(near[0]) - midi)).toBe(best);
          expect(new Set(near).size).toBe(1);
        });
      }
    });
  });

  test("Scale.steps", () => {
    expect([-3, -2, -1, 0, 1, 2].map(Scale.steps("C4 major"))).toEqual([
      "G3",
      "A3",
      "B3",
      "C4",
      "D4",
      "E4",
    ]);
  });
});

// Every spelling of a midi number, up to double accidentals
function enharmonics(midi: number): string[] {
  const names = ["C", "D", "E", "F", "G", "A", "B"].flatMap((l) =>
    ["bb", "b", "", "#", "##"].map((acc) => l + acc),
  );
  const result: string[] = [];
  for (const pc of names) {
    for (let oct = 2; oct <= 6; oct++) {
      if (note(pc + oct).height === midi) result.push(pc + oct);
    }
  }
  return result;
}
