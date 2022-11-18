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

Examples:

```js
Midi.freqToMidi(220); //=> 57
Midi.freqToMidi(261.62); //=> 60
Midi.freqToMidi(261); //=> 59.96
```
