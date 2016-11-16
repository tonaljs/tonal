# tonal [![npm](https://img.shields.io/npm/v/tonal.svg)](https://www.npmjs.com/package/tonal) [![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal) [![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)

`tonal` is a functional music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

Think like an [underscorejs](http://underscorejs.org/) (or better: [ramdajs](http://ramdajs.com/)) library for music theory.

[Read the API documentation](http://danigb.github.io/tonal/api/)

## Example

```js
var tonal = require('tonal')

// note properties
tonal.note.pc('Db5') // => 'Db'
tonal.note.oct('C4') // => 4
tonal.note.chroma('Cb') // => 11
tonal.note.simplify('B#3') // => 'C4'
tonal.note.freq('C#2')
tonal.note.midi('A4') // => 69
tonal.note.fromMidi()
tonal.note.fromFreq()

// interval properties
tonal.ivl.semitones('5P') // => 7
tonal.ivl.invert('3m') // => '6M'
tonal.ivl.fromSemitones(7) // => '5P'

// transposition
tonal.transpose('D4', '2M') // => 'E#4'
// distances between notes
tonal.interval('C', 'G') // => '5P'
// distance in semitones
tonal.semitones('C', 'G') // => 7

// scales
tonal.scale('Bb lydian') // => [ 'Ab', 'Bb', 'C', 'D', 'Eb', 'F', 'G' ]
tonal.scale('Eb bebop') // => [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ]
tonal.scale.names()

// chords
tonal.chord('Fm7b5') // => [ 'F', 'Ab', 'Cb', 'Eb' ]
tonal.chord.names()

// partial application
var fifthUp = tonal.transpose('P5')
fifthUp('c3') // => 'G3'
tonal.scale('G melodic minor').map(tonal.transpose('m3')) // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'G', 'A' ]

// map lists
tonal.map(tonal.note.pc, 'C2 Eb5 gx4') // => ['C', 'Eb', 'G##']
tonal.map(tonal.transpose('3M'), 'c d e') // => ['E4', 'F#4', 'G#4']

// map functions
var pcs = tonal.map(tonal.pc)
pcs('C2 db3 e5') // => ['C', 'Db', 'E']
var fifthUpAll = tonal.map(tonal.transpose('5P'))
fifthUpAll('c d e') // => ['G', 'A', 'B']

// Create note ranges
tonal.range.chromatic(['C4, F4, D4']) // => [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'E4', 'Eb4', 'D4' ]
// Filter ranges to certain notes
tonal.range.pitchSet('C Eb G Bb', ['C3', 'C4', 'C3']) // => ['C3', 'Eb3', 'G3', 'Bb3', 'C4', 'Bb3', 'G3', 'Eb3', 'C3']

// create harmonizers
var maj7 = tonal.harmonizer('P1 M3 P5 M7')
maj7('C2') // => ['C2', 'E2', 'G2', 'B2']

// extract intervals
tonal.harmonics('C Eb G Bb') // => ['1P', '3m', '5P', '7m']
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
- Small and fast
- Modular
- Different notations: scientific notation by default. Helmholtz coming. Change it easily.
- Documented: all public functions are documented inside the code. Aside the generated documentation (in API.md file) a 'usage' guides are provided for each module.
- Learneable: since all the modules share the same philosophy is easy to work with them.
- Tested: carefully tested with coverage support.
- Advanced features: chord and scale detection, binary sets, chord progressions, key signatures...


## License

MIT License
