# note-harmonizer [![npm version](https://img.shields.io/npm/v/note-harmonizer.svg)](https://www.npmjs.com/package/note-harmonizer)

[![tonal](https://img.shields.io/badge/tonal-music--gamut-yellow.svg)](https://www.npmjs.com/package/tonal)

`note-harmonizer` is a module with a function to harmonize notes, create harmonizers (like chords, for example) or get relative intervals from a collection of notes:

```js
var harmonize = require('note-harmonizer')

// harmonize a note
harmonize('1 3 5', 'G2') // => ['G2', 'B2', 'D3']

// create an harmonizer
var maj7Chord = harmonize('1 3 5 7')
var maj7Chord('A4') // => ['A4', 'C#5', 'E5', 'G#5']

// get relative intervals
harmonize('C Eb G Bb', false) // => ['P1', 'm3', 'P5', 'm7']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save note-harmonizer`

## Usage

#### Harmonize notes

You can harmonize notes using a collection of intervals. If the note is a pitch class (a note without octave), the result is a collection of pitch classes:

```js
harmonize('1 b3 5 b7 9', 'C2') // => ['C2', 'Eb2', 'G2', 'Bb2', 'D3']
harmonize('1 b3 5 b7 9', 'C') // => ['C', 'Eb', 'G', 'Bb', 'D']
```

You can harmonize from a list of notes (the first is considered to be the tonic):

```js
harmonize('C E G', 'A') // => ['A', 'C#', 'E']
var domChord = harmonize('A C# E G')
domChord('D') // => ['D', 'F#', 'G', 'C']
```

#### Create harmonizers

Like most tonal functions, it can be partially applied (very useful to create chord-like structures):

```js
var m7 = harmonize('1 b3 5 b7')
m7('C') // => ['C', 'Eb', 'G', 'Bb']
```

#### Get intervals

If `false` is passed as tonic, you can extract intervals:

```js
harmonize('D F A C', false) // => ['1P', '3m', '5P', '7m']
```

#### Filter pitches

Finally, it tonic is `null` you get the notes or intervals without transformation:

```js
harmonize('c2 D4 blah P4', null) // => ['C2', 'D4', null, '4P']
```

## License

MIT License
