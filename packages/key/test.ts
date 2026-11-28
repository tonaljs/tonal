// tslint:disable-next-line: no-implicit-dependencies
import { describe, expect, test } from "vitest";

import { get as scale } from "@tonaljs/scale";
// tslint:disable-next-line: no-implicit-dependencies
import { get as chord, chordScale } from "@tonaljs/chord";
import { note } from "@tonaljs/pitch-note";
import * as Key from "./index";

// A list of chord names, with "-" for an empty one
const $ = (names: string) =>
  names.split(" ").map((name) => (name === "-" ? "" : name));

describe("@tonal/key", () => {
  test("fromAlter", () => {
    expect(Key.majorTonicFromKeySignature("###")).toEqual("A");
    expect(Key.majorTonicFromKeySignature(3)).toEqual("A");
    expect(Key.majorTonicFromKeySignature("b")).toEqual("F");
    expect(Key.majorTonicFromKeySignature("bb")).toEqual("Bb");
    expect(Key.majorTonicFromKeySignature("other")).toEqual(null);
    expect(Key.majorTonicFromKeySignature("")).toEqual("C");
    expect(Key.majorTonicFromKeySignature(0)).toEqual("C");
  });
  test("fromAlter rejects mixed or non accidental signatures", () => {
    expect(Key.majorTonicFromKeySignature("F#")).toEqual(null);
    expect(Key.majorTonicFromKeySignature("Bb")).toEqual(null);
    expect(Key.majorTonicFromKeySignature("b#")).toEqual(null);
    expect(Key.majorTonicFromKeySignature("bb#")).toEqual(null);
    expect(Key.majorTonicFromKeySignature("bx")).toEqual(null);
    expect(Key.majorTonicFromKeySignature("x#")).toEqual(null);
  });
  test("fromAlter reads back majorKey keySignature", () => {
    const tonics = "Cb Gb Db Ab Eb Bb F C G D A E B F# C#".split(" ");
    expect(
      tonics.map((tonic) =>
        Key.majorTonicFromKeySignature(Key.majorKey(tonic).keySignature),
      ),
    ).toEqual(tonics);
  });
  test("major keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(
      tonics.map((tonic) => Key.majorKey(tonic).keySignature).join(" "),
    ).toEqual(" ## #### b # ### #####");
  });

  test("minor keySignature", () => {
    const tonics = "C D E F G A B".split(" ");
    expect(
      tonics.map((tonic) => Key.minorKey(tonic).keySignature).join(" "),
    ).toEqual("bbb b # bbbb bb  ##");
  });

  describe("scale names", () => {
    test("natural scales", () => {
      const chordScales = Key.minorKey("C").natural.chordScales;
      expect(chordScales.map(scale).map((scale) => scale.name)).toEqual([
        "C minor",
        "D locrian",
        "Eb major",
        "F dorian",
        "G phrygian",
        "Ab lydian",
        "Bb mixolydian",
      ]);
    });

    test("harmonic scales", () => {
      const chordScales = Key.minorKey("C").harmonic.chordScales;
      expect(chordScales.map(scale).map((scale) => scale.name)).toEqual([
        "C harmonic minor",
        "D locrian 6",
        "Eb major augmented",
        "F dorian #4",
        "G phrygian dominant",
        "Ab lydian #9",
        "B ultralocrian",
      ]);
    });

    test("melodic scales", () => {
      const chordScales = Key.minorKey("C").melodic.chordScales;
      expect(chordScales.map(scale).map((scale) => scale.name)).toEqual([
        "C melodic minor",
        "D dorian b2",
        "Eb lydian augmented",
        "F lydian dominant",
        "G mixolydian b6",
        "A locrian #2",
        "B altered",
      ]);
    });
  });

  test("secondary dominants", () => {
    expect(Key.majorKey("C").secondaryDominants).toEqual([
      "",
      "A7",
      "B7",
      "C7",
      "D7",
      "E7",
      "",
    ]);
  });

  test("minor key chords stack thirds, but the melodic tonic is m6", () => {
    const tonics = "CDEFGAB".split("").flatMap((l) => [l + "b", l, l + "#"]);
    for (const tonic of tonics) {
      const { natural, harmonic, melodic } = Key.minorKey(tonic);
      for (const { scale: notes, chords } of [natural, harmonic, melodic]) {
        chords.forEach((name, i) => {
          if (chords === melodic.chords && i === 0) {
            expect(name).toEqual(tonic + "m6");
            return;
          }
          const stacked = [0, 2, 4, 6].map((step) => notes[(i + step) % 7]);
          expect([name, chord(name).notes]).toEqual([name, stacked]);
        });
      }
    }
  });

  test("octaves are discarded", () => {
    expect(Key.majorKey("b4").scale.join(" ")).toEqual("B C# D# E F# G# A#");
    expect(Key.majorKey("g4").chords.join(" ")).toEqual(
      "Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F#m7b5",
    );
    expect(Key.minorKey("C4").melodic.scale.join(" ")).toEqual(
      "C D Eb F G A B",
    );
    expect(Key.minorKey("C4").melodic.chords.join(" ")).toEqual(
      "Cm6 Dm7 Eb+maj7 F7 G7 Am7b5 Bm7b5",
    );
  });

  test("valid chord names", () => {
    const major = Key.majorKey("C");
    const minor = Key.minorKey("C");

    [
      major.chords,
      major.secondaryDominants,
      major.secondaryDominantSupertonics,
      major.substituteDominants,
      major.substituteDominantSupertonics,
      ...[minor.natural, minor.harmonic, minor.melodic].flatMap((scale) => [
        scale.chords,
        scale.secondaryDominants,
        scale.secondaryDominantSupertonics,
        scale.substituteDominants,
        scale.substituteDominantSupertonics,
      ]),
    ].forEach((chords) => {
      chords.forEach((name) => {
        if (name !== "") {
          if (chord(name).name === "") throw Error(`Invalid chord: ${name}`);
          expect(chord(name).name).not.toBe("");
        }
      });
    });
  });

  describe("supertonics", () => {
    const major = Key.majorKey("C");
    const { natural, harmonic, melodic } = Key.minorKey("C");

    test("the ii of a secondary dominant is m7b5 before a minor target and m7 before a major one", () => {
      // A7 → Dm, B7 → Em, C7 → F, D7 → G, E7 → Am
      expect(major.secondaryDominantSupertonics).toEqual(
        $("- Em7b5 F#m7b5 Gm7 Am7 Bm7b5 -"),
      );
      // G7 → Cm, C7 → Fm, D7 → Gm, Eb7 → Ab, F7 → Bb
      expect(natural.secondaryDominantSupertonics).toEqual(
        $("Dm7b5 - - Gm7b5 Am7b5 Bbm7 Cm7"),
      );
      // C7 → Fm, D7 → G, Eb7 → Ab
      expect(harmonic.secondaryDominantSupertonics).toEqual(
        $("- - - Gm7b5 Am7 Bbm7 -"),
      );
      // A7 → Dm, C7 → F, D7 → G
      expect(melodic.secondaryDominantSupertonics).toEqual(
        $("- Em7b5 - Gm7 Am7 - -"),
      );
    });

    test("the ii of a substitute dominant is always m7", () => {
      // Eb7 → Dm, F7 → Em, Gb7 → F, Ab7 → G, Bb7 → Am
      expect(major.substituteDominantSupertonics).toEqual(
        $("- Bbm7 Cm7 Dbm7 Ebm7 Fm7 -"),
      );
      expect(natural.substituteDominantSupertonics).toEqual(
        $("Abm7 - - Dbm7 Ebm7 Em7 F#m7"),
      );
      expect(harmonic.substituteDominantSupertonics).toEqual(
        $("- - - Dbm7 Ebm7 Em7 -"),
      );
      expect(melodic.substituteDominantSupertonics).toEqual(
        $("- Bbm7 - Dbm7 Ebm7 - -"),
      );
    });

    test("deprecated aliases", () => {
      for (const key of [major, natural, harmonic, melodic]) {
        expect(key.secondaryDominantsMinorRelative).toEqual(
          key.secondaryDominantSupertonics,
        );
        expect(key.substituteDominantsMinorRelative).toEqual(
          key.substituteDominantSupertonics,
        );
      }
    });
  });

  test("C major", () => {
    expect(Key.majorKey("C")).toMatchSnapshot();
  });
  test("C major chords", () => {
    expect(Key.majorKeyChords("C")).toMatchSnapshot();
    const chords = Key.majorKeyChords("C");
    expect(chords.find((chord) => chord.name === "Am7")).toEqual({
      name: "Am7",
      roles: ["T", "ii/V"],
    });
    expect(chords.find((chord) => chord.name === "Em7b5")).toEqual({
      name: "Em7b5",
      roles: ["ii/II"],
    });
  });

  test("C minor chords", () => {
    expect(Key.minorKeyChords("C")).toMatchSnapshot();
  });
  test("majorKeys", () => {
    expect(Key.majorKey("A")).toMatchSnapshot();
    expect(Key.majorKey("Bb")).toMatchSnapshot();
    expect(Key.majorKey("E")).toMatchSnapshot();
  });

  test("empty major key ", () => {
    expect(Key.majorKey("")).toMatchObject({
      type: "major",
      tonic: "",
    });
    expect(Object.keys(Key.majorKey("C")).sort()).toEqual(
      Object.keys(Key.majorKey("")).sort(),
    );
  });

  test("minorKey", () => {
    expect(Key.minorKey("C")).toMatchSnapshot();
    expect(Key.minorKey("Bb")).toMatchSnapshot();
    expect(Key.minorKey("B")).toMatchSnapshot();
  });

  test("empty minor key ", () => {
    expect(Key.minorKey("nothing")).toMatchObject({
      type: "minor",
      tonic: "",
    });
    expect(Object.keys(Key.minorKey("C")).sort()).toEqual(
      Object.keys(Key.minorKey("nothing")).sort(),
    );
  });

  // every key from 7 flats to 7 sharps, major and the three minor scales
  const allKeyScales = () =>
    Array.from({ length: 15 }, (_, i) => i - 7).flatMap((sig) => {
      const major = Key.majorKey(Key.majorTonicFromKeySignature(sig) ?? "");
      const minor = Key.minorKey(major.minorRelative);
      return [major, minor.natural, minor.harmonic, minor.melodic];
    });

  test("substitute dominants are spelled with fewer accidentals", () => {
    // as Chord.tritoneSubstitute: B7, not Cb7, for F7
    expect(Key.majorKey("Eb").substituteDominants).toEqual(
      $("- Gb7 Ab7 A7 B7 Db7 -"),
    );
    expect(Key.majorKey("Eb").substituteDominantSupertonics).toEqual(
      $("- Dbm7 Ebm7 Em7 F#m7 Abm7 -"),
    );
    expect(Key.majorKey("Gb").substituteDominants).toEqual(
      $("- A7 B7 C7 D7 E7 -"),
    );
    expect(Key.minorKey("C").natural.substituteDominants).toEqual(
      $("Db7 - - Gb7 Ab7 A7 B7"),
    );
    const awkward = allKeyScales()
      .flatMap((s) => [
        ...s.substituteDominants,
        ...s.substituteDominantSupertonics,
      ])
      .filter((name) => /^([A-G](bb|##)|Cb|Fb|E#|B#)/.test(name));
    expect(awkward).toEqual([]);
  });

  test("every chord scale has only the notes of its key", () => {
    // compared as pitch classes: some scales are spelled their own way
    // (G altered is G Ab A# B C# Eb F, the key has Bb Cb Db)
    const chromas = (notes: readonly string[]) =>
      notes.map((n) => note(n).chroma).sort((a, b) => a - b);
    for (const keyScale of allKeyScales()) {
      keyScale.chordScales.forEach((name, i) => {
        const notes = scale(name).notes;
        expect(chromas(notes), name).toEqual(chromas(keyScale.scale));
        expect(notes[0], name).toBe(keyScale.scale[i]);
      });
    }
  });

  test("Chord.chordScale in a key agrees with the key's chord scales", () => {
    for (const tonic of ["C", "F", "Bb", "Db", "E", "F#"]) {
      const major = Key.majorKey(tonic);
      const minor = Key.minorKey(major.minorRelative);
      const scales: [string, Key.KeyScale][] = [
        [`${tonic} major`, major],
        [`${minor.tonic} minor`, minor.natural],
        [`${minor.tonic} harmonic minor`, minor.harmonic],
        [`${minor.tonic} melodic minor`, minor.melodic],
      ];
      for (const [key, keyScale] of scales) {
        keyScale.chords.forEach((name, i) => {
          const expected = scale(keyScale.chordScales[i]).name;
          expect([key, name, chordScale(name, { key })]).toEqual([
            key,
            name,
            expected,
          ]);
          const triad = keyScale.triads[i];
          expect([key, triad, chordScale(triad, { key })]).toEqual([
            key,
            triad,
            expected,
          ]);
        });
      }
    }
  });
});
