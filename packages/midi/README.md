# @tonaljs/midi ![tonal](https://img.shields.io/badge/@tonaljs-midi-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/midi.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/midi)

> A collection of functions to work with midi numbers.

## Usage

ES6:

```js
import { Midi } from "tonal";
```

nodejs:

```js
const { Midi } = require("tonal");
```

## API

### `toMidi(note: string | number) => number | null`

Given a note name or number, return the midi number. Midi numbers are always in range 0..127

Examples:

```js
Midi.toMidi("C4"); // => 60
Midi.toMidi("#"); // => null
Midi.toMidi(60); // => 60
Midi.toMidi("60"); // => 60
Midi.toMidi(-1); // => null
```

### `midiToFreq(midi: number, tuning = 440) => number`

Given a midi number, return the frequency:

Examples:

```js
Midi.midiToFreq(60); // => 261.6255653005986
Midi.midiToFreq(69); // => 440
Midi.midiToFreq(69, 443); // => 443
```

### `midiToNoteName(midi: number) => string`

Given a midi number, returns a note name. The altered notes will have flats unless explicitly set with the optional `useSharps` parameter.

Examples:

```js
Midi.midiToNoteName(61); // => "Db4"
Midi.midiToNoteName(61, { pitchClass: true }); // => "Db"
Midi.midiToNoteName(61, { sharps: true }); // => "C#4"
Midi.midiToNoteName(61, { pitchClass: true, sharps: true }); // => "C#"
// it rounds to nearest note
midiToNoteName(61.7); // => "D4"
```

### `freqToMidi(freq: number) => number`

Given a frequency in hertz, returns the midi number. The midi number can have decimals (with two digits precision)

Example:

```js
Midi.freqToMidi(220); //=> 57
Midi.freqToMidi(261.62); //=> 60
Midi.freqToMidi(261); //=> 59.96
```

### `pcset(set: number[] | string) => number[]`

Return the pitch class set from a number of midi note numbers or pcset chroma.

A pitch class set in this `Midi` package refers to a unique sorted collection of notes between 0 and 11 (that represents the pitch class of the note.

Example:

```js
Midi.pcset([62, 63, 60, 65, 70, 72]); // => [0, 2, 3, 5, 10]
Midi.pcset("100100100101"); // => [0, 3, 6, 9, 11]
```

You can read more about pitch classes on `Note` module.

The string is a pitch class chroma, a string with a binary representation of a set. Read more about pitch class chroma in `Pcset` module documentation.

### `pcsetNearest(set: number[] | string) => (midi: number) => number | undefined`

Returns a function that finds the nearest midi note of a pitch class set. Can be used to constrain a note to a scale, for example:

```js
const nearest = Midi.pcsetNearest(Scale.get("D dorian").chroma);
[60, 61, 62, 63, 64, 65, 66].map(nearest); // => [60, 62, 62, 63, 65, 65, 67]
```

### `pcsetSteps(set: number[] | string, tonic: number) => (index: number) => number`

Returns a function to map a pitch class set over any note. Given a tonic a pitch class set, step 0 means the first note, step 1 the second, and so on:

```js
const steps = Midi.pcsetSteps(Scale.get("D dorian").chroma, 60);
[-2, -1, 0, 1, 2, 3].map(steps); // => [ 57, 58, 60, 62, 63, 65 ]
```

A similar function called `pcsetDegrees` exists that just uses 1 as first note instead of 0 (more common in music theory books). See `Scale.degrees` and `Chord.degrees` for more information.
