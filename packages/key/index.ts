import { romanNumeral } from "@tonaljs/roman-numeral";
import { transpose } from "@tonaljs/tonal";

export interface Key {
  type: "major" | "minor";
  tonic: string;
}

interface KeyScale {
  tonic: string;
  grades: string[];
  intervals: string[];
  scale: string[];
  chords: string[];
  chordsHarmonicFunction: string[];
}

export interface MajorKey extends Key, KeyScale {
  type: "major";
  scale: string[];
  secondaryDominants: string[];
  secondaryDominantsMinorRelative: string[];
  substituteDominants: string[];
  substituteDominantsMinorRelative: string[];
}
export interface MinorKey extends Key {
  type: "minor";
  natural: KeyScale;
  harmonic: KeyScale;
  melodic: KeyScale;
}

const mapToScale = (scale: string[], literal: string) =>
  literal
    .split(" ")
    .map((item, index) => (item !== "-" ? scale[index] + item : ""));

function keyScale(
  gradesLiteral: string,
  chordsLiteral: string,
  hfLiteral: string
) {
  return (tonic: string): KeyScale => {
    const grades = gradesLiteral.split(" ");
    const intervals = grades.map(gr => romanNumeral(gr).interval || "");
    const scale = intervals.map(interval => transpose(tonic, interval));

    return {
      tonic,
      grades,
      intervals,
      scale,
      chords: mapToScale(scale, chordsLiteral),
      chordsHarmonicFunction: hfLiteral.split(" ")
    };
  };
}

const MajorScale = keyScale(
  "I II III IV V VI VII",
  "maj7 m7 m7 maj7 7 m7 m7b5",
  "T SD T SD D T D"
);
const NaturalScale = keyScale(
  "I II bIII IV V bVI bVII",
  "m7 m7b5 maj7 m7 m7 maj7 7",
  "T SD T SD D SD SD"
);
const HarmonicScale = keyScale(
  "I II bIII IV V bVI VII",
  "mmaj7 m7b5 +maj7 m7 7 maj7 mo7",
  "T SD T SD D SD D"
);
const MelodicScale = keyScale(
  "I II bIII IV V VI VII",
  "m6 m7 +maj7 7 7 m7b5 m7b5",
  "T SD T SD D - -"
);

export function majorKey(tonic: string): MajorKey {
  const keyScale = MajorScale(tonic);
  return {
    ...keyScale,
    type: "major",
    secondaryDominants: mapToScale(keyScale.scale, "- VI7 VII7 I7 II7 III7 -"),
    secondaryDominantsMinorRelative: mapToScale(
      keyScale.scale,
      "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -"
    ),
    substituteDominants: mapToScale(
      keyScale.scale,
      "- bIII7 IV7 bV7 bVI7 bVII7 -"
    ),
    substituteDominantsMinorRelative: mapToScale(
      keyScale.scale,
      "- IIIm7 Im7 IIbm7 VIm7 IVm7 -"
    )
  };
}

export function minorKey(tonic: string): MinorKey {
  return {
    type: "minor",
    tonic,
    natural: NaturalScale(tonic),
    harmonic: HarmonicScale(tonic),
    melodic: MelodicScale(tonic)
  };
}
