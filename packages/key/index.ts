import { accToAlt, altToAcc, note, transpose } from "@tonaljs/core";
import { transposeFifths } from "@tonaljs/note";
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
  readonly chords: readonly string[];
  readonly chordsHarmonicFunction: readonly string[];
  readonly chordScales: readonly string[];
}

const NoKeyScale: KeyScale = {
  tonic: "",
  grades: Empty,
  intervals: Empty,
  scale: Empty,
  chords: Empty,
  chordsHarmonicFunction: Empty,
  chordScales: Empty,
};

export interface MajorKey extends Key, KeyScale {
  readonly type: "major";
  readonly minorRelative: string;
  readonly scale: readonly string[];
  readonly secondaryDominants: readonly string[];
  readonly secondaryDominantsMinorRelative: readonly string[];
  readonly substituteDominants: readonly string[];
  readonly substituteDominantsMinorRelative: readonly string[];
}

const NoMajorKey: MajorKey = {
  ...NoKey,
  ...NoKeyScale,
  type: "major",
  minorRelative: "",
  scale: Empty,
  secondaryDominants: Empty,
  secondaryDominantsMinorRelative: Empty,
  substituteDominants: Empty,
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

const mapScaleToType = (scale: string[], list: string[], sep = "") =>
  list.map((type, i) => `${scale[i]}${sep}${type}`);

function keyScale(
  grades: string[],
  chords: string[],
  harmonicFunctions: string[],
  chordScales: string[]
) {
  return (tonic: string): KeyScale => {
    const intervals = grades.map((gr) => roman(gr).interval || "");
    const scale = intervals.map((interval) => transpose(tonic, interval));

    return {
      tonic,
      grades,
      intervals,
      scale,
      chords: mapScaleToType(scale, chords),
      chordsHarmonicFunction: harmonicFunctions.slice(),
      chordScales: mapScaleToType(scale, chordScales, " "),
    };
  };
}

const distInFifths = (from: string, to: string) => {
  const f = note(from);
  const t = note(to);
  return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
};

const MajorScale = keyScale(
  "I II III IV V VI VII".split(" "),
  "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
  "T SD T SD D T D".split(" "),
  "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")
);
const NaturalScale = keyScale(
  "I II bIII IV V bVI bVII".split(" "),
  "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
  "T SD T SD D SD SD".split(" "),
  "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")
);
const HarmonicScale = keyScale(
  "I II bIII IV V bVI VII".split(" "),
  "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
  "T SD T SD D SD D".split(" "),
  "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
    ","
  )
);
const MelodicScale = keyScale(
  "I II bIII IV V VI VII".split(" "),
  "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
  "T SD T SD D  ".split(" "),
  "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
    ","
  )
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
  const romanInTonic = (src: string) => {
    const r = roman(src);
    if (r.empty) return "";

    return transpose(tonic, r.interval) + r.chordType;
  };

  return {
    ...keyScale,
    type: "major",
    minorRelative: transpose(pc, "-3m"),
    alteration,
    keySignature: altToAcc(alteration),
    secondaryDominants: "- VI7 VII7 I7 II7 III7 -".split(" ").map(romanInTonic),
    secondaryDominantsMinorRelative: "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -"
      .split(" ")
      .map(romanInTonic),
    substituteDominants: "- bIII7 IV7 bV7 bVI7 bVII7 -"
      .split(" ")
      .map(romanInTonic),
    substituteDominantsMinorRelative: "- IIIm7 Im7 IIbm7 VIm7 IVm7 -"
      .split(" ")
      .map(romanInTonic),
  };
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
  sig: string | number
): string | null {
  if (typeof sig === "number") {
    return transposeFifths("C", sig);
  } else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
    return transposeFifths("C", accToAlt(sig));
  }
  return null;
}

export default { majorKey, majorTonicFromKeySignature, minorKey };
