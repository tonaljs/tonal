import { transpose, transposeFifths } from "@tonaljs/note";
import { accToAlt, altToAcc, note } from "@tonaljs/pitch-note";
import { get as roman } from "@tonaljs/roman-numeral";

const Empty: readonly string[] = Object.freeze([] as string[]);

export interface Key {
  readonly type: "major" | "minor";
  readonly tonic: string;
  readonly alteration: number;
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
  readonly grades: readonly string[];
  readonly intervals: readonly string[];
  readonly scale: readonly string[];
  readonly triads: readonly string[];
  readonly chords: readonly string[];
  readonly chordsHarmonicFunction: readonly string[];
  readonly chordScales: readonly string[];
  readonly secondaryDominants: readonly string[];
  readonly secondaryDominantSupertonics: readonly string[];
  readonly substituteDominants: readonly string[];
  readonly substituteDominantSupertonics: readonly string[];

  // @deprecated use secondaryDominantsSupertonic
  readonly secondaryDominantsMinorRelative: readonly string[];
  // @deprecated use substituteDominantSupertonics
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
  readonly minorRelative: string;
  readonly scale: readonly string[];
  readonly substituteDominants: readonly string[];
  readonly secondaryDominantSupertonics: readonly string[];
  // @deprecated use secondaryDominantsSupertonic
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
  readonly relativeMajor: string;
  readonly natural: KeyScale;
  readonly harmonic: KeyScale;
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
  name: string;
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
    const substituteDominantSupertonics = supertonics(
      substituteDominants,
      triads,
    );

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

      // @deprecated use secondaryDominantsSupertonic
      secondaryDominantsMinorRelative: secondaryDominantSupertonics,
      // @deprecated use secondaryDominantsSupertonic
      substituteDominantsMinorRelative: substituteDominantSupertonics,
    };
  };
}

const supertonics = (dominants: string[], targetTriads: string[]) => {
  return dominants.map((chord, index) => {
    if (!chord) return "";
    const domRoot = chord.slice(0, -1);
    const minorRoot = transpose(domRoot, "5P");
    const target = targetTriads[index];
    const isMinor = target.endsWith("m");
    return isMinor ? minorRoot + "m7" : minorRoot + "m7b5";
  });
};

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
 * Get a major key properties in a given tonic
 * @param tonic
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
 * Get a list of available chords for a given major key
 * @param tonic
 * @returns array of { name: string, roles: string[] }
 */
export function majorKeyChords(tonic: string): KeyChord[] {
  const key = majorKey(tonic);
  const chords: KeyChord[] = [];
  keyChordsOf(key, chords);
  return chords;
}

/**
 * Get a list of available chords for a given major key
 * @param tonic
 * @returns array of { name: string, roles: string[] }
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
 * Get minor key properties in a given tonic
 * @param tonic
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
 * Given a key signature, returns the tonic of the major key
 * @param sigature
 * @example
 * majorTonicFromKeySignature('###') // => 'A'
 */
export function majorTonicFromKeySignature(
  sig: string | number,
): string | null {
  if (typeof sig === "number") {
    return transposeFifths("C", sig);
  } else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
    return transposeFifths("C", accToAlt(sig));
  }
  return null;
}

/** @deprecated */
export default { majorKey, majorTonicFromKeySignature, minorKey };
