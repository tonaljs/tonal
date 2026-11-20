import { transpose, transposeFifths } from "@tonaljs/note";
import { accToAlt, altToAcc, note } from "@tonaljs/pitch-note";
import { get as roman } from "@tonaljs/roman-numeral";

const Empty: readonly string[] = Object.freeze([] as string[]);

export interface Key {
  readonly type: "major" | "minor";
  /** The tonic pitch class, like "F". Empty for an invalid key. */
  readonly tonic: string;
  /** Number of accidentals in the key signature: positive for sharps, negative for flats. */
  readonly alteration: number;
  /** The key signature as accidentals: "" (none), "bb" (two flats), "###" (three sharps). */
  readonly keySignature: string;
}

const NoKey: Key = {
  type: "major",
  tonic: "",
  alteration: 0,
  keySignature: "",
};

export interface KeyScale {
  readonly tonic: string;
  /** Roman numeral of each degree, like ["I", "II", "bIII", ...]. */
  readonly grades: readonly string[];
  /** Interval from the tonic to each degree, like ["1P", "2M", "3M", ...]. */
  readonly intervals: readonly string[];
  /** Notes of the scale, one per degree. */
  readonly scale: readonly string[];
  /** Triad of each degree, like ["F", "Gm", "Am", ...]. */
  readonly triads: readonly string[];
  /** Seventh chord of each degree, like ["Fmaj7", "Gm7", ...]. */
  readonly chords: readonly string[];
  /** Harmonic function of each chord: "T" (tonic), "SD" (subdominant) or "D" (dominant). Empty string if none. */
  readonly chordsHarmonicFunction: readonly string[];
  /** Scale that fits each chord, like ["F major", "G dorian", ...]. */
  readonly chordScales: readonly string[];
  /** Dominant seventh chord that resolves to each degree ("" if the degree has none), like ["", "D7", "E7", ...] for F major. */
  readonly secondaryDominants: readonly string[];
  /** The ii chord that precedes each secondary dominant ("" if none): a minor seventh, or a half-diminished chord when the target is minor. */
  readonly secondaryDominantSupertonics: readonly string[];
  /** Tritone substitution of each secondary dominant ("" if none): the dominant seventh a tritone away. */
  readonly substituteDominants: readonly string[];
  /** The minor seventh ii chord that precedes each substitute dominant ("" if none). */
  readonly substituteDominantSupertonics: readonly string[];

  /** @deprecated use secondaryDominantSupertonics */
  readonly secondaryDominantsMinorRelative: readonly string[];
  /** @deprecated use substituteDominantSupertonics */
  readonly substituteDominantsMinorRelative: readonly string[];
}

const NoKeyScale: KeyScale = {
  tonic: "",
  grades: Empty,
  intervals: Empty,
  scale: Empty,
  triads: Empty,
  chords: Empty,
  chordsHarmonicFunction: Empty,
  chordScales: Empty,
  secondaryDominants: Empty,
  secondaryDominantSupertonics: Empty,
  substituteDominantsMinorRelative: Empty,
  substituteDominants: Empty,
  substituteDominantSupertonics: Empty,
  secondaryDominantsMinorRelative: Empty,
};

export interface MajorKey extends Key, KeyScale {
  readonly type: "major";
  /** Tonic of the relative minor key, like "D" for "F". */
  readonly minorRelative: string;
  readonly scale: readonly string[];
  readonly substituteDominants: readonly string[];
  readonly secondaryDominantSupertonics: readonly string[];
  /** @deprecated use substituteDominantSupertonics */
  readonly substituteDominantsMinorRelative: readonly string[];
}

const NoMajorKey: MajorKey = {
  ...NoKey,
  ...NoKeyScale,
  type: "major",
  minorRelative: "",
  scale: Empty,
  substituteDominants: Empty,
  secondaryDominantSupertonics: Empty,
  substituteDominantsMinorRelative: Empty,
};

export interface MinorKey extends Key {
  readonly type: "minor";
  /** Tonic of the relative major key, like "C" for "A". */
  readonly relativeMajor: string;
  /** Natural minor (aeolian) scale and its chords. */
  readonly natural: KeyScale;
  /** Harmonic minor scale and its chords. */
  readonly harmonic: KeyScale;
  /** Melodic minor (ascending) scale and its chords. */
  readonly melodic: KeyScale;
}

const NoMinorKey: MinorKey = {
  ...NoKey,
  type: "minor",
  relativeMajor: "",
  natural: NoKeyScale,
  harmonic: NoKeyScale,
  melodic: NoKeyScale,
};

export type KeyChord = {
  /** Chord symbol, like "Dm7". */
  name: string;
  /** Functions the chord plays in the key: "T", "SD", "D", or "V/II", "ii/V", "subV/II", "subii/II" for secondary and substitute dominants. */
  roles: string[];
};

const mapScaleToType = (scale: string[], list: string[], sep = "") =>
  list.map((type, i) => `${scale[i]}${sep}${type}`);

function keyScale(
  grades: string[],
  triads: string[],
  chordTypes: string[],
  harmonicFunctions: string[],
  chordScales: string[],
) {
  return (tonic: string): KeyScale => {
    const intervals = grades.map((gr) => roman(gr).interval || "");
    const scale = intervals.map((interval) => transpose(tonic, interval));
    const chords = mapScaleToType(scale, chordTypes);
    const secondaryDominants = scale
      .map((note) => transpose(note, "5P"))
      .map((note) =>
        // A secondary dominant is a V chord which:
        // 1. is not diatonic to the key,
        // 2. it must have a diatonic root.
        scale.includes(note) && !chords.includes(note + "7") ? note + "7" : "",
      );

    const secondaryDominantSupertonics = supertonics(
      secondaryDominants,
      triads,
    );
    const substituteDominants = secondaryDominants.map((chord) => {
      if (!chord) return "";
      const domRoot = chord.slice(0, -1);
      const subRoot = transpose(domRoot, "5d");
      return subRoot + "7";
    });
    const substituteDominantSupertonics =
      substituteSupertonics(substituteDominants);

    return {
      tonic,
      grades,
      intervals,
      scale,
      triads: mapScaleToType(scale, triads),
      chords,
      chordsHarmonicFunction: harmonicFunctions.slice(),
      chordScales: mapScaleToType(scale, chordScales, " "),
      secondaryDominants,
      secondaryDominantSupertonics,
      substituteDominants,
      substituteDominantSupertonics,

      // deprecated aliases
      secondaryDominantsMinorRelative: secondaryDominantSupertonics,
      substituteDominantsMinorRelative: substituteDominantSupertonics,
    };
  };
}

// The root of the ii chord of a dominant: a fifth above its root
const supertonicRoot = (dominant: string) =>
  transpose(dominant.slice(0, -1), "5P");

// The ii of a secondary dominant takes its quality from the target: a ii-V
// into a minor or diminished chord uses a half-diminished ii (Em7b5 A7 Dm),
// and into a major or augmented chord a minor seventh ii (Gm7 C7 F)
const supertonics = (dominants: string[], targetTriads: string[]) =>
  dominants.map((chord, index) => {
    if (!chord) return "";
    const target = targetTriads[index];
    const isMinor = target === "m" || target === "dim";
    return supertonicRoot(chord) + (isMinor ? "m7b5" : "m7");
  });

// A substitute dominant doesn't resolve to the key it points to (Eb7 resolves
// to Dm, not Ab), so its ii is always a minor seventh: Bbm7 Eb7 Dm
const substituteSupertonics = (dominants: string[]) =>
  dominants.map((chord) => (chord ? supertonicRoot(chord) + "m7" : ""));

const distInFifths = (from: string, to: string) => {
  const f = note(from);
  const t = note(to);
  return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
};

const MajorScale = keyScale(
  "I II III IV V VI VII".split(" "),
  " m m   m dim".split(" "),
  "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
  "T SD T SD D T D".split(" "),
  "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(","),
);
const NaturalScale = keyScale(
  "I II bIII IV V bVI bVII".split(" "),
  "m dim  m m  ".split(" "),
  "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
  "T SD T SD D SD SD".split(" "),
  "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(","),
);
const HarmonicScale = keyScale(
  "I II bIII IV V bVI VII".split(" "),
  "m dim aug m   dim".split(" "),
  "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
  "T SD T SD D SD D".split(" "),
  "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
    ",",
  ),
);
const MelodicScale = keyScale(
  "I II bIII IV V VI VII".split(" "),
  "m m aug   dim dim".split(" "),
  "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
  "T SD T SD D  ".split(" "),
  "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
    ",",
  ),
);

/**
 * Get a major key: its signature, scale, triads, seventh chords, harmonic
 * functions and secondary and substitute dominants. For an invalid tonic
 * it returns a key with empty strings and arrays.
 *
 * @param tonic - the tonic note or pitch class, like "F" or "Bb"
 * @example
 * Key.majorKey("F").scale; // => ["F", "G", "A", "Bb", "C", "D", "E"]
 * Key.majorKey("F").chords; // => ["Fmaj7", "Gm7", "Am7", "Bbmaj7", "C7", "Dm7", "Em7b5"]
 * Key.majorKey("F").keySignature; // => "b"
 */
export function majorKey(tonic: string): MajorKey {
  const pc = note(tonic).pc;
  if (!pc) return NoMajorKey;

  const keyScale = MajorScale(pc);
  const alteration = distInFifths("C", pc);

  return {
    ...keyScale,
    type: "major",
    minorRelative: transpose(pc, "-3m"),
    alteration,
    keySignature: altToAcc(alteration),
  };
}

/**
 * Get the chords available in a major key, each with the roles it plays:
 * diatonic chords ("T", "SD", "D") and secondary and substitute dominants
 * with their supertonics ("V/II", "ii/V", "subV/II"...). Returns an empty
 * array for an invalid tonic.
 *
 * @param tonic - the tonic note or pitch class, like "C"
 * @returns array of { name: string, roles: string[] }
 * @example
 * Key.majorKeyChords("C").slice(0, 3); // => [{ name: "Cmaj7", roles: ["T"] }, { name: "Dm7", roles: ["SD"] }, { name: "Em7", roles: ["T"] }]
 */
export function majorKeyChords(tonic: string): KeyChord[] {
  const key = majorKey(tonic);
  const chords: KeyChord[] = [];
  keyChordsOf(key, chords);
  return chords;
}

/**
 * Get the chords available in a minor key, each with the roles it plays. It
 * merges the chords of the natural, harmonic and melodic scales, so a chord
 * that appears in several scales has all its roles. Returns an empty array
 * for an invalid tonic.
 *
 * @param tonic - the tonic note or pitch class, like "A"
 * @returns array of { name: string, roles: string[] }
 * @example
 * Key.minorKeyChords("A").slice(0, 2); // => [{ name: "Am7", roles: ["T", "ii/bVII"] }, { name: "Bm7b5", roles: ["SD", "ii/I"] }]
 */
export function minorKeyChords(tonic: string): KeyChord[] {
  const key = minorKey(tonic);
  const chords: KeyChord[] = [];
  keyChordsOf(key.natural, chords);
  keyChordsOf(key.harmonic, chords);
  keyChordsOf(key.melodic, chords);
  return chords;
}

function keyChordsOf(key: KeyScale, chords: KeyChord[]) {
  const updateChord = (name: string, newRole: string) => {
    if (!name) return;
    let keyChord = chords.find((chord) => chord.name === name);
    if (!keyChord) {
      keyChord = { name, roles: [] };
      chords.push(keyChord);
    }
    if (newRole && !keyChord.roles.includes(newRole)) {
      keyChord.roles.push(newRole);
    }
  };

  key.chords.forEach((chordName, index) =>
    updateChord(chordName, key.chordsHarmonicFunction[index]),
  );
  key.secondaryDominants.forEach((chordName, index) =>
    updateChord(chordName, `V/${key.grades[index]}`),
  );
  key.secondaryDominantSupertonics.forEach((chordName, index) =>
    updateChord(chordName, `ii/${key.grades[index]}`),
  );
  key.substituteDominants.forEach((chordName, index) =>
    updateChord(chordName, `subV/${key.grades[index]}`),
  );
  key.substituteDominantSupertonics.forEach((chordName, index) =>
    updateChord(chordName, `subii/${key.grades[index]}`),
  );
}

/**
 * Get a minor key: its signature, relative major and the scale, chords and
 * dominants of its natural, harmonic and melodic forms. For an invalid tonic
 * it returns a key with empty strings and arrays.
 *
 * @param tnc - the tonic note or pitch class, like "A"
 * @example
 * Key.minorKey("A").relativeMajor; // => "C"
 * Key.minorKey("A").harmonic.scale; // => ["A", "B", "C", "D", "E", "F", "G#"]
 * Key.minorKey("A").natural.chords; // => ["Am7", "Bm7b5", "Cmaj7", "Dm7", "Em7", "Fmaj7", "G7"]
 */
export function minorKey(tnc: string): MinorKey {
  const pc = note(tnc).pc;
  if (!pc) return NoMinorKey;

  const alteration = distInFifths("C", pc) - 3;
  return {
    type: "minor",
    tonic: pc,
    relativeMajor: transpose(pc, "3m"),
    alteration,
    keySignature: altToAcc(alteration),
    natural: NaturalScale(pc),
    harmonic: HarmonicScale(pc),
    melodic: MelodicScale(pc),
  };
}

/**
 * Get the tonic of the major key with the given key signature, or null if
 * the signature is not valid.
 *
 * @param sig - accidentals ("", "bb", "###") or a number of fifths (positive for sharps, negative for flats)
 * @example
 * Key.majorTonicFromKeySignature("###"); // => "A"
 * Key.majorTonicFromKeySignature(-2); // => "Bb"
 * Key.majorTonicFromKeySignature(""); // => "C"
 */
export function majorTonicFromKeySignature(
  sig: string | number,
): string | null {
  if (typeof sig === "number") {
    return transposeFifths("C", sig);
  } else if (typeof sig === "string" && /^(b*|#*)$/.test(sig)) {
    return transposeFifths("C", accToAlt(sig));
  }
  return null;
}

/** @deprecated Use the named exports instead. */
export default { majorKey, majorTonicFromKeySignature, minorKey };
