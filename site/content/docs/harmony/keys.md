---
title: Keys
description: Key scales and chords
package: Key
---

Obtain information of a key's scales and chords:

```js
import * as Key from "tonal";

Key.majorKey("C").triads; // => ["C", "Dm", "Em", "F", "G" "Am", "Bdim"],
Key.majorKeyChords("C").find((chord) => chord.name === "Em"); // => { name: "Em", roles: ["T", "ii/II"] }
```

## API

Tonics of any key are represented with pitch classes (octaves are discarded).

```js
Key.major("C4"); // is equal to
Key.major("C");
```

### `Key.majorKey`

`majorKey(tonic: string) => MajorKey`

Major key properties for a given tonic. Example:

```js
Key.majorKey("C") // =>
{
  tonic: "C",
  type: "major",
  minorRelative: "A",
  alteration: 0,
  keySignature: "",
  grades: ["I", "II", "III", "IV", "V", "VI", "VII"],
  intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
  scale: ["C", "D", "E", "F", "G", "A", "B"],
  triads: ["C", "Dm", "Em", "F", "G" "Am", "Bdim"],
  chords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7" "Am7", "Bm7b5"],
  chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "T", "D"],
  chordScales: ["C major", "D dorian", "E phrygian", "F lydian", "G mixolydian", "A minor", "B locrian"],
  secondaryDominants: ["", "A7", "B7", "C7", "D7", "E7", ""],
  secondaryDominantsSupertonics: [""  "Em7b5", "F#m7", "Gm7", "Am7",  "Bm7b5", ""],
  substituteDominants: ["" "Eb7", "F7",  "Gb7", "Ab7", "Bb7", ""],
  substituteDominantsSupertonics: [ '', 'Bbm7', 'Cm7', 'Dbm7b5', 'Ebm7b5', 'Fm7', '' ],
}
```

### `Key.minorKey`

`minorKey(tonic: string) => MinorKey`

Minor key properties for a given tonic. Example:

```js
Key.minorKey("C") // =>
{
  tonic: "C",
  type: "minor",
  relativeMajor: "Eb",
  alteration: -3,
  keySignature: "bbb",
  natural: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "bVI", "bVII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7m"],
    scale: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
    triads: ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"],
    chords: ["Cm7", "Dm7b5", "Ebmaj7", "Fm7", "Gm7", "Abmaj7", "Bb7"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "SD", "SD"],
    chordScales: [
      "C minor",
      "D locrian",
      "Eb major",
      "F dorian",
      "G phrygian",
      "Ab lydian",
      "Bb mixolydian",
    ],
    secondaryDominants: ["G7", "", "", "C7", "D7", "Eb7", "F7"],
    secondaryDominantSupertonics: [
      "Dm7",
      "",
      "",
      "Gm7",
      "Am7",
      "Bbm7b5",
      "Cm7b5",
    ],
    substituteDominants: ["Db7", "", "", "Gb7", "Ab7", "Bbb7", "Cb7"],
    substituteDominantSupertonics: [
      "Abm7",
      "",
      "",
      "Dbm7",
      "Ebm7",
      "Fbm7b5",
      "Gbm7b5",
    ],
    secondaryDominantsMinorRelative: [
      "Dm7",
      "",
      "",
      "Gm7",
      "Am7",
      "Bbm7b5",
      "Cm7b5",
    ],
    substituteDominantsMinorRelative: [
      "Abm7",
      "",
      "",
      "Dbm7",
      "Ebm7",
      "Fbm7b5",
      "Gbm7b5",
    ],
  },
  harmonic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "bVI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "Ab", "B"],
    triads: ["Cm", "Ddim", "Ebaug", "Fm", "G", "Ab", "Bdim"],
    chords: ["CmMaj7", "Dm7b5", "Eb+maj7", "Fm7", "G7", "Abmaj7", "Bo7"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "SD", "D"],
    chordScales: [
      "C harmonic minor",
      "D locrian 6",
      "Eb major augmented",
      "F lydian diminished",
      "G phrygian dominant",
      "Ab lydian #9",
      "B ultralocrian",
    ],
    secondaryDominants: ["", "", "", "C7", "D7", "Eb7", ""],
    secondaryDominantSupertonics: ["", "", "", "Gm7", "Am7b5", "Bbm7b5", ""],
    substituteDominants: ["", "", "", "Gb7", "Ab7", "Bbb7", ""],
    substituteDominantSupertonics: ["", "", "", "Dbm7", "Ebm7b5", "Fbm7b5", ""],
    secondaryDominantsMinorRelative: ["", "", "", "Gm7", "Am7b5", "Bbm7b5", ""],
    substituteDominantsMinorRelative: [
      "",
      "",
      "",
      "Dbm7",
      "Ebm7b5",
      "Fbm7b5",
      "",
    ],
  },
  melodic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "VI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6M", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "A", "B"],
    triads: ["Cm", "Dm", "Ebaug", "F", "G", "Adim", "Bdim"],
    chords: ["Cm6", "Dm7", "Eb+maj7", "F7", "G7", "Am7b5", "Bm7b5"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "", ""],
    chordScales: [
      "C melodic minor",
      "D dorian b2",
      "Eb lydian augmented",
      "F lydian dominant",
      "G mixolydian b6",
      "A locrian #2",
      "B altered",
    ],
    secondaryDominants: ["", "A7", "", "C7", "D7", "", ""],
    secondaryDominantSupertonics: ["", "Em7", "", "Gm7b5", "Am7b5", "", ""],
    substituteDominants: ["", "Eb7", "", "Gb7", "Ab7", "", ""],
    substituteDominantSupertonics: ["", "Bbm7", "", "Dbm7b5", "Ebm7b5", "", ""],
    secondaryDominantsMinorRelative: ["", "Em7", "", "Gm7b5", "Am7b5", "", ""],
    substituteDominantsMinorRelative: [
      "",
      "Bbm7",
      "",
      "Dbm7b5",
      "Ebm7b5",
      "",
      "",
    ],
  },
};
```

### `Key.majorTonicFromKeySignature`

`majorTonicFromKeySignature(keySignature: string)`

Example:

```js
Key.majorTonicFromKeySignature("bbb"); // => Eb
```

### `Key.majorKeyChords`

`majorKeyChords(tonic: string) => Array<{ name: string, roles: string[] }>`

Return a list of all available chords for a given major key. Is an array of `{ name: string, roles: string[] }`

```js
Key.majorKeyChords("C")
  .map((chord) => chord.name)
  .join(", ");
// => "Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5, A7, B7, C7, D7, E7, F#m7, Gm7b5, Am7b5, Bm7, Eb7, F7, Gb7, Ab7, Bb7, Bbm7, Cm7, Dbm7b5, Ebm7b5, Fm7"
```

### `Key.minorKeyChords`

`minorKeyChords(tonic: string) => Array<{ name: string, roles: string[] }>`

Return a list of all available chords for a given minor key:

```js
Key.minorKeyChords("C")
  .map((chord) => chord.name)
  .join(", ");
// => "Cm7, Dm7b5, Ebmaj7, Fm7, Gm7, Abmaj7, Bb7, G7, C7, D7, Eb7, F7, Dm7, Am7, Bbm7b5, Cm7b5, Db7, Gb7, Ab7, Bbb7, Cb7, Abm7, Dbm7, Ebm7, Fbm7b5, Gbm7b5, CmMaj7, Eb+maj7, Bo7, Am7b5, Ebm7b5, Cm6, Bm7b5, A7, Em7, Gm7b5, Bbm7, Dbm7b5"
```

## How to...

### How to get minor tonic from key signature

```js
majorKey(majorTonicFromKeySignature("###")).relativeMinor; // => "F#"
```
