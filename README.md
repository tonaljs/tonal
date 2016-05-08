# tonal [![npm](https://img.shields.io/npm/v/tonal.svg)](https://www.npmjs.com/package/tonal) [![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal) [![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)

`tonal` is a functional music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

__This library is under active development.__

## Example

```js
var tonal = require('tonal')

// midi and frequency
tonal.toMidi('A4') // => 64
tonal.fromMidi(60) // => 'C4'
tonal.toFreq('A4') // => 440
tonal.fromFreq(220) // => 'A3'

// note transposition
tonal.tr('D4', '2M') // => 'E#4'
// interval distance between notes
tonal.dist('C', 'G') // => '5P'
// distance in semitones
tonal.semitones(tonal.dist('C', 'G')) // => 7

// partial function application
var upFifth = tonal.tr('P5')
upFifth('c3') // => 'G3'
upFifth('g3') // => 'D4'

// work with arrays
tonal.asArr('c db eb f gb') // => ['C', 'Db', 'Eb', 'F', 'Gb']

// map list of notes using functions
tonal.map(tonal.tr('3M'), 'c d e') // => ['E4', 'F#4', 'G#4']
// get pitch classes using pc function
tonal.map(tonal.pc, 'C2 Eb5 gx4') // => ['C', 'Eb', 'G##']

// map functions (partial map application)
var pcs = tonal.map(tonal.pc)
pcs('C2 db3 e5') // => ['C', 'Db', 'E']
var up5 = tonal.map(tonal.tr('5P'))
up5('c d e') // => ['G', 'A', 'B']

// Create note ranges
tonal.chromatic('C2', 'F4') // => [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4' ]
// build the cycle of fifths
tonal.scaleRange('C D Eb F G Ab Bb', 'C3', 'C4') // => ['C3', 'D3', 'Eb3', ... 'C4']

// create harmonizers
var maj7 = tonal.harmonizer('P1 M3 P5 M7')
maj7('C2') // => ['C2', 'E2', 'G2', 'B2']
```

## Features

Although `tonal` is a work in progress, currently is implemented (but not all released):

- Note, intervals, transposition, distances, enharmonics
- Midi and frequency conversion
- Scales, chords, dictionaries
- Work with collection of notes: gamut, harmonizer
- Pitch sets and binary representations
- Keys, keys signatures, key scales and chords, key detection

## Philosophy

This library is evolving with this ideas in mind:

- Functional: no classes, no side effects, no mutations. Just functions, data-in data-out. Most of the functions has the data to operate on as last argument and lot of functions are currified.
- Notes and intervals are represented with strings, instead of objects. Easy and concise code.
- Small (8,6kb minified) and fast
- Modular
- Different notations: scientific notation by default. Helmholtz coming. Change it easily.
- Documented: all public functions are documented inside the code. Aside the generated documentation (in API.md file) a 'usage' guides are provided for each module.
- Learneable: since all the modules share the same philosophy is easy to work with them.
- Tested: carefully tested with coverage support.
- Advanced features: chord and scale detection, binary sets, chord progressions, key signatures...

## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

Also, I want a complete library, where I can model all what I learn, with some (for me) esoteric features like interval classes, binary scales and other weird stuff.

## What

Tonal is a small library to manipulate notes and intervals, perform transpositions, calculate distances and work with collections of notes.

You can read the [generated API documentation here](https://github.com/danigb/tonal/blob/tonal2/docs/API.md). You can read the [documented source code here](https://cdn.rawgit.com/danigb/tonal/tonal2/docs/tonal.html).

```js
var T = require('tonal')

// notes and intervals
tonal.toMidi('A4') // => 69
tonal.fromMidi(60) // => 'C4'
tonal.toFreq('C2') // => 65.40639132514966
tonal.fromFreq(220) // => 'A3'
tonal.semitones('P8') // => 12

// transposition and distances
tonal.tranpose('D4', '2M') // => 'E#4'
tonal.interval('C', 'G') // => '5P'

// work with collections
tonal.map(tonal.transpose('3M'), 'c d e') // => ['E4', 'F#4', 'G#4']
var maj7 = tonal.harmonizer('P1 M3 P5 M7')
maj7('C2') // => ['C2', 'E2', 'G2', 'B2']
tonal.sort('F G a D C') // => ['C', 'D', 'F', 'G', 'A']
tonal.max('C4 C#3 A4') // => 'A4'
```

#### `tonal-scales` and `tonal-chords`

```js
var scales = require('tonal-scales')

scales.get('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']

var chords = require('tonal-chords')
chords.get('D7') // => ['D', 'F#', 'A', 'C']
```


#### `tonal-range`

```js
import { range, take } from 'tonal-range'

// create a chromatic range
range(null, 'C3', 'G5')
// => ['C3', 'Db3', 'D3', 'Eb3', ... 'G5']

// create a range from 'C3' to 'C5' using scale 'C E G'
range('C E G', 'C3', 'C5')
// => ['C3', 'E3', 'G3', 'C4', 'E4', 'G5', 'C5']

// create a descending range from 'C4' to 'C3' using scale 'C phrygian'
range(scales.get('C phrygian'), 'C4', 'C3')

// take 24 notes from a chromatic scale starting from 'A4'
take(null, 'A4', 24)
// => ['A4', 'Bb4', 'B4', 'C5', ... 'A6']

// take 15 first notes of C major starting from C2
take(scales.get('C major'), 'C2', 15)
```

#### `tonal-keys`

```js
// keys
key('###') // => 'A major'
key.signature('A major') // => '###'
key.altNotes('A major') // => ['F#', 'C#']
key.relative('minor', 'A major') // => 'F minor'
```


## License

MIT License
