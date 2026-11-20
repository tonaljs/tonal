# Midi

> Manipulate midi notes

```js
import { Midi } from "tonal";

Midi.toMidi("C4"); // => 60
```

## API

### `Midi.toMidi`

`toMidi(note: string | number) => number | null`

Given a note name or number, return the midi number. Midi numbers are always in range 0..127

Examples:

```js
Midi.toMidi("C4"); // => 60
Midi.toMidi("#"); // => null
Midi.toMidi(60); // => 60
Midi.toMidi("60"); // => 60
Midi.toMidi(-1); // => null
```

### `Midi.isMidi`

`isMidi(value: any) => boolean`

Test if the value is a midi number (a number or a numeric string between 0 and 127):

```js
Midi.isMidi(60); // => true
Midi.isMidi("60"); // => true
Midi.isMidi(128); // => false
Midi.isMidi("C4"); // => false
```

### `Midi.midiToFreq`

`midiToFreq(midi: number, tuning = 440) => number`

Given a midi number, return the frequency:

Examples:

```js
Midi.midiToFreq(60); // => 261.6255653005986
Midi.midiToFreq(69); // => 440
Midi.midiToFreq(69, 443); // => 443
```

### `Midi.midiToNoteName`

`midiToNoteName(midi: number, options?: { pitchClass?: boolean, sharps?: boolean }) => string`

Given a midi number, returns a note name. The altered notes will have flats unless the `sharps` option is set, and the `pitchClass` option returns the note without octave.

Examples:

```js
Midi.midiToNoteName(61); // => "Db4"
Midi.midiToNoteName(61, { pitchClass: true }); // => "Db"
Midi.midiToNoteName(61, { sharps: true }); // => "C#4"
Midi.midiToNoteName(61, { pitchClass: true, sharps: true }); // => "C#"
// it rounds to nearest note
Midi.midiToNoteName(61.7); // => "D4"
```

### `Midi.freqToMidi`

`freqToMidi(freq: number) => number`

Given a frequency in hertz, returns the midi number. The midi number can have decimals (with two digits precision)

Example:

```js
Midi.freqToMidi(220); //=> 57
Midi.freqToMidi(261.62); //=> 60
Midi.freqToMidi(261); //=> 59.96
```

### `Midi.chroma`

`chroma(midi: number) => number`

Get the pitch class of a midi number, from 0 up to (not including) 12:

```js
Midi.chroma(61); // => 1
Midi.chroma(72); // => 0
Midi.chroma(-1); // => 11
```

A decimal midi number keeps its fraction, so `Midi.chroma(61.5)` is `1.5`. `Midi.pcset` rounds to the nearest note instead.

### `Midi.pcset`

`pcset(set: number[] | string) => number[]`

Return the pitch class set from a number of midi note numbers or pcset chroma.

A pitch class set in this `Midi` package is a unique, sorted list of whole numbers from 0 to 11 (the pitch classes of the notes). Decimal midi numbers, such as the ones `Midi.freqToMidi` returns, are rounded to the nearest note first (a half goes up), and numbers that aren't finite are ignored.

Example:

```js
Midi.pcset([62, 63, 60, 65, 70, 72]); // => [0, 2, 3, 5, 10]
Midi.pcset("100100100101"); // => [0, 3, 6, 9, 11]
Midi.pcset([60.4, 64, 67.6]); // => [0, 4, 8]
```

You can read more about pitch classes on `Note` module.

The string is a pitch class chroma, a string with a binary representation of a set. Read more about pitch class chroma in `Pcset` module documentation.

### `Midi.pcsetNearest`

`pcsetNearest(set: number[] | string) => (midi: number) => number | undefined`

Returns a function that finds the nearest midi note of a pitch class set. Can be used to constrain a note to a scale, for example:

```js
const nearest = Midi.pcsetNearest(Scale.get("D dorian").chroma);
[60, 61, 62, 63, 64, 65, 66].map(nearest); // => [60, 62, 62, 63, 65, 65, 67]
```

It also works with decimal midi numbers, like the ones from `freqToMidi`:

```js
const nearest = Midi.pcsetNearest(Scale.get("C major").chroma);
nearest(Midi.freqToMidi(261)); // => 60
nearest(61.4); // => 62
```

### `Midi.pcsetSteps`

`pcsetSteps(set: number[] | string, tonic: number) => (index: number) => number`

Returns a function to map a pitch class set over any note. Given a tonic a pitch class set, step 0 means the first note, step 1 the second, and so on:

```js
const steps = Midi.pcsetSteps(Scale.get("D dorian").chroma, 60);
[-2, -1, 0, 1, 2, 3].map(steps); // => [ 57, 58, 60, 62, 63, 65 ]
```

A similar function called `pcsetDegrees` exists that just uses 1 as first note instead of 0 (more common in music theory books). See `Scale.degrees` and `Chord.degrees` for more information.

### `Midi.pcsetDegrees`

`pcsetDegrees(set: number[] | string, tonic: number) => (degree: number) => number | undefined`

Same as `Midi.pcsetSteps`, but degrees start at 1 (the tonic), negative degrees go down from the tonic and degree 0 returns `undefined`:

```js
const degrees = Midi.pcsetDegrees(Scale.get("D dorian").chroma, 60);
[1, 2, 3, -1].map(degrees); // => [60, 62, 63, 58]
degrees(0); // => undefined
```
