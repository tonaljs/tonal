# @tonaljs/key ![tonal](https://img.shields.io/badge/@tonaljs-key-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/key.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/key)

`@tonaljs/key`

Get scale and chords of major and minor keys.

## Usage

ES6:

```js
import { Key } from "@tonaljs/tonal";
```

nodejs:

```js
const { Key } = require("@tonaljs/tonal");
```

## API

#### `majorKey(tonic: string) => MajorKey`

Major key properties for a given tonic. Example:

```js
Key.majorKey('C') // =>
{
  tonic: "C",
  type: "major",
  keySignature: "",
  relativeMinor: "A",
  grades: ["I", "II", "III", "IV", "V", "VI", "VII"],
  intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
  scale: ["C", "D", "E", "F", "G", "A", "B"],
  chords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"],
  chordScales: ["C major", "D dorian", "E phrygian", "F lydian", "G mixolydian", "A minor", "B locrian"],
  chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "T", "D"],
  secondaryDominants: ["", "DVI7", "EVII7", "FI7", "GII7", "AIII7", ""],
  secondaryDominantsMinorRelative: ["", "DIIIm7b5", "EIV#m7", "FVm7", "GVIm7", "AVIIm7b5", ""],
  substituteDominants: ["", "DbIII7", "EIV7", "FbV7", "GbVI7", "AbVII7", ""],
  substituteDominantsMinorRelative: ["", "DIIIm7", "EIm7", "FIIbm7", "GVIm7", "AIVm7", ""],
}
```

#### `minorKey(tonic: string) => MinorKey`

Minor key properties for a given tonic. Example:

```js
Key.minorKey('C') // =>
{
  tonic: "C",
  type: "minor",
  keySignature: "bbb",
  relativeMajor: "Eb",
  natural: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "bVI", "bVII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7m"],
    scale: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
    chords: ["Cm7", "Dm7b5", "Ebmaj7", "Fm7", "Gm7", "Abmaj7", "Bb7"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "SD", "SD"],
    chordScales: ["C minor", "D locrian", "Eb major", "F dorian", "G phrygian", "Ab lydian", "Bb mixolydian"],
  },
  harmonic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "bVI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "Ab", "B"],
    chords: ["Cmmaj7", "Dm7b5", "Eb+maj7", "Fm7", "G7", "Abmaj7", "Bmo7"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "SD", "D"],
    chordScales: ["C harmonic minor", "D locrian 6", "Eb ionian #5", "F dorian #11", "G phrygian dominant", "Ab lydian #2", "B super locrian bb7",
    ],

  },
  melodic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "VI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6M", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "A", "B"],
    chords: ["Cm6", "Dm7", "Eb+maj7", "F7", "G7", "Am7b5", "Bm7b5"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "-", "-"],
    chordScales: ["C melodic minor", "D Dorian b2", "Eb Lydian augmented", "F Lydian dominant", "G Mixolydian b6", "A locrian 9", "B altered",
    ],
  },
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
majorKey(majorTonicFromKeySignature("###")).relativeMinor; // => 'F#'
```
