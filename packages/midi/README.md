# @tonaljs/midi ![tonal](https://img.shields.io/badge/@tonaljs-midi-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/midi.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/midi)

> A collection of functions to work with midi numbers.

## Usage

ES6:

```js
import { Midi } from "@tonaljs/tonal";
```

nodejs:

```js
const { Midi } = require("@tonaljs/tonal");
```

## API

### `toMidi(note: string | number) => number | null`

Given a note name or number, return the midi number. Midi numbers are always in range 0..127

Examples:

```js
toMidi("C4"); // => 60
toMidi("#"); // => null
toMidi(60); // => 60
toMidi("60"); // => 60
toMidi(-1); // => null
```

### `midiToFreq(midi: number, tuning = 440) => number`

Given a midi number, return the frequency:

Examples:

```js
midiToFreq(60); // => 261.6255653005986
midiToFreq(69); // => 440
midiToFreq(69, 443); // => 443
```

### `midiToNoteName(midi: number) => string`

Given a midi number, returns a note name. The altered notes will have flats unless explicitly set with the optional `useSharps` parameter.

Examples:

```js
midiToNoteName(61); // => "Db4"
midiToNoteName(61, { pitchClass: true }); // => "Db"
midiToNoteName(61, { sharps: true }); // => "C#4"
midiToNoteName(61, { pitchClass: true, sharps: true }); // => "C#"
// it rounds to nearest note
midiToNoteName(61.7); // => "D4"
```

### `freqToMidi(freq: number) => number`

Get the midi number from a frequency in hertz. The midi number can have decimals (with two digits precission)

Examples:

```js
freqToMidi(220)); //=> 57
freqToMidi(261.62)); //=> 60
freqToMidi(261)); //=> 59.96
```
