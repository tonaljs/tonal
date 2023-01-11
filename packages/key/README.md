# @tonaljs/key ![tonal](https://img.shields.io/badge/@tonaljs-key-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/key.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/key)

`@tonaljs/key`

Get scale and chords of major and minor keys.

## Usage

ES6:

```js
import { Key } from "tonal";
```

nodejs:

```js
const { Key } = require("tonal");
```

## API

Tonics of any key are represented with pitch classes (octaves are discarded).

```js
Key.major("C4"); // is equal to
Key.major("C");
```

#### `majorKey(tonic: string) => MajorKey`

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
  secondaryDominantsMinorRelative: [""  "Em7b5", "F#m7", "Gm7", "Am7",  "Bm7b5", ""],
  substituteDominants: ["" "Eb7", "F7",  "Gb7", "Ab7", "Bb7", ""],
  substituteDominantsMinorRelative: ["" "Em7", "Cm7", "Dbm7", "Am7", "Fm7", ""]
}
```

#### `minorKey(tonic: string) => MinorKey`

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
    scale: ["C",  "D", "Eb", "F",  "G", "Ab", "Bb"],
    triads: ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"],
    chords: ["Cm7", "Dm7b5", "Ebmaj7", "Fm7", "Gm7", "Abmaj7", "Bb7"],
    chordsHarmonicFunction: ["T", "SD", "T",  "SD", "D", "SD", "SD"],
    chordScales: ["C minor", "D locrian", "Eb major", "F dorian", "G phrygian", "Ab lydian", "Bb mixolydian"
    ]
  },
  harmonic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "bVI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "Ab", "B"],
    triads: ["Cm", "Ddim", "Ebaug", "Fm", "G", "Ab", "Bdim"],
    chords: ["CmMaj7",  "Dm7b5", "Eb+maj7", "Fm7", "G7" "Abmaj7", "Bo7"],
    chordsHarmonicFunction: ["T",  "SD", "T", "SD", "D",  "SD", "D"],
    chordScales: ["C harmonic minor", "D locrian 6", "Eb major augmented", "F lydian diminished", "G phrygian dominant", "Ab lydian #9", "B ultralocrian"
    ]
  },
  melodic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "VI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6M", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "A", "B"],
    triads: ["Cm", "Dm", "Ebaug", "F", "G", "Adim", "Bdim"],
    chords: ["Cm6", "Dm7", "Eb+maj7", "F7", "G7", "Am7b5", "Bm7b5" ],
    chordsHarmonicFunction: ["T",  "SD", "T", "SD", "D",  "", ""],
    chordScales: ["C melodic minor", "D dorian b2", "Eb lydian augmented", "F lydian dominant", "G mixolydian b6", "A locrian #2", "B altered"
    ]
  }
}
```

#### `majorTonicFromKeySignature(keySignature: string)`

Example:

```js
Key.majorTonicFromKeySignature("bbb"); // => Eb
```

## HOW TO

##### How to get minor tonic from key signature

```js
majorKey(majorTonicFromKeySignature("###")).relativeMinor; // => "F#"
```
