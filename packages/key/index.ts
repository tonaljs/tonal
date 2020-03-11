import { accToAlt, altToAcc, note, transpose } from "@tonaljs/core";
import { transposeFifths } from "@tonaljs/note";
import { get as roman } from "@tonaljs/roman-numeral";

export interface Key {
  type: "major" | "minor";
  tonic: string;
  alteration: number;
  keySignature: string;
}

interface KeyScale {
  tonic: string;
  grades: string[];
  intervals: string[];
  scale: string[];
  chords: string[];
  chordsHarmonicFunction: string[];
  chordScales: string[];
}

export interface MajorKey extends Key, KeyScale {
  type: "major";
  minorRelative: string;
  scale: string[];
  secondaryDominants: string[];
  secondaryDominantsMinorRelative: string[];
  substituteDominants: string[];
  substituteDominantsMinorRelative: string[];
}
export interface MinorKey extends Key {
  type: "minor";
  relativeMajor: string;
  natural: KeyScale;
  harmonic: KeyScale;
  melodic: KeyScale;
}

const mapToScale = (scale: string[]) => (symbols: string[], sep = "") =>
  symbols.map((symbol, index) =>
    symbol !== "-" ? scale[index] + sep + symbol : ""
  );

function keyScale(
  gradesLiteral: string,
  chordsLiteral: string,
  hfLiteral: string,
  chordScalesLiteral: string
) {
  return (tonic: string): KeyScale => {
    const grades = gradesLiteral.split(" ");
    const intervals = grades.map(gr => roman(gr).interval || "");
    const scale = intervals.map(interval => transpose(tonic, interval));
    const map = mapToScale(scale);

    return {
      tonic,
      grades,
      intervals,
      scale,
      chords: map(chordsLiteral.split(" ")),
      chordsHarmonicFunction: hfLiteral.split(" "),
      chordScales: map(chordScalesLiteral.split(","), " ")
    };
  };
}

const distInFifths = (from: string, to: string) => {
  const f = note(from);
  const t = note(to);
  return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
};

const MajorScale = keyScale(
  "I II III IV V VI VII",
  "maj7 m7 m7 maj7 7 m7 m7b5",
  "T SD T SD D T D",
  "major,dorian,phrygian,lydian,mixolydian,minor,locrian"
);
const NaturalScale = keyScale(
  "I II bIII IV V bVI bVII",
  "m7 m7b5 maj7 m7 m7 maj7 7",
  "T SD T SD D SD SD",
  "minor,locrian,major,dorian,phrygian,lydian,mixolydian"
);
const HarmonicScale = keyScale(
  "I II bIII IV V bVI VII",
  "mmaj7 m7b5 +maj7 m7 7 maj7 mo7",
  "T SD T SD D SD D",
  "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian"
);
const MelodicScale = keyScale(
  "I II bIII IV V VI VII",
  "m6 m7 +maj7 7 7 m7b5 m7b5",
  "T SD T SD D - -",
  "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered"
);

/**
 * Get a major key properties in a given tonic
 * @param tonic
 */
export function majorKey(tonic: string): MajorKey {
  const keyScale = MajorScale(tonic);
  const alteration = distInFifths("C", tonic);
  const map = mapToScale(keyScale.scale);

  return {
    ...keyScale,
    type: "major",
    minorRelative: transpose(tonic, "-3m"),
    alteration,
    keySignature: altToAcc(alteration),
    secondaryDominants: map("- VI7 VII7 I7 II7 III7 -".split(" ")),
    secondaryDominantsMinorRelative: map(
      "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -".split(" ")
    ),
    substituteDominants: map("- bIII7 IV7 bV7 bVI7 bVII7 -".split(" ")),
    substituteDominantsMinorRelative: map(
      "- IIIm7 Im7 IIbm7 VIm7 IVm7 -".split(" ")
    )
  };
}

/**
 * Get minor key properties in a given tonic
 * @param tonic
 */
export function minorKey(tonic: string): MinorKey {
  const alteration = distInFifths("C", tonic) - 3;
  return {
    type: "minor",
    tonic,
    relativeMajor: transpose(tonic, "3m"),
    alteration,
    keySignature: altToAcc(alteration),
    natural: NaturalScale(tonic),
    harmonic: HarmonicScale(tonic),
    melodic: MelodicScale(tonic)
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
