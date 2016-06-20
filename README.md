# tonal [![npm](https://img.shields.io/npm/v/tonal.svg)](https://www.npmjs.com/package/tonal) [![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal) [![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)

`tonal` is a functional music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

Think like an [underscorejs](http://underscorejs.org/) (or better: [ramdajs](http://ramdajs.com/)) library for music theory.

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
tonal.transpose('D4', '2M') // => 'E#4'
// interval distance between notes
tonal.distance('C', 'G') // => '5P'
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
tonal.chromatic('C4, F4, D4') // => [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'E4', 'Eb4', 'D4' ]
// Filter ranges to certain notes
tonal.scaleRange('C Eb G Bb', 'C3, C4, C3') // => ['C3', 'Eb3', 'G3', 'Bb3', 'C4', 'Bb3', 'G3', 'Eb3', 'C3']

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

## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

Also, I want a complete library, where I can model all what I learn, with some (for me) esoteric features like interval classes, binary scales and other weird stuff.

## What

Tonal itself is built from a collection of [modules](https://github.com/danigb/tonal/tree/master/modules). Some of they are exposed in the `tonal` package that can be installed via npm: `npm i tonal`. Some others must be required explicitly, like scales: `npm i tonal-scales`

### Modules included in `tonal` package

Although you can install any of this modules individually, they are all included in the `tonal` package by default:

#### [tonal-note](https://github.com/danigb/tonal/tree/master/modules/note) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)
  - [noteName](https://github.com/danigb/tonal/tree/master/modules/note#noteName): get the note name
  - [chroma](https://github.com/danigb/tonal/tree/master/modules/note#chroma): get chroma of a note
  - [pc](https://github.com/danigb/tonal/tree/master/modules/note#pc): get pitch class of a note
  - [enharmonics](https://github.com/danigb/tonal/tree/master/modules/note#enenharmonics): get a list of note enharmonics
  - [simpleEnh](https://github.com/danigb/tonal/tree/master/modules/note#simpleEnh): get the simplest enharmonic of a note

#### [tonal-interval](https://github.com/danigb/tonal/tree/master/modules/interval) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
  - [ivlName](https://github.com/danigb/tonal/tree/master/modules/interval#vilName): get the interval name
  - [semitones](https://github.com/danigb/tonal/tree/master/modules/interval#semitones): get the size of an interval in semitones
  - [fromSemitones](https://github.com/danigb/tonal/tree/master/modules/interval#fromSemitones): create an interval from a semitones number
  - [ic](https://github.com/danigb/tonal/tree/master/modules/interval#ic): get interval class
  - [itype](https://github.com/danigb/tonal/tree/master/modules/interval#itype): get interval type
  - [invert](https://github.com/danigb/tonal/tree/master/modules/interval#invert): invert interval
  - [simplify](https://github.com/danigb/tonal/tree/master/modules/interval#ssimplify): simplify interval

#### [tonal-midi](https://github.com/danigb/tonal/tree/master/modules/midi) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-midi.svg)](https://www.npmjs.com/package/tonal-midi)
  - [isMidiNum](https://github.com/danigb/tonal/tree/master/modules/midi#isMidiNum): test if the given number is a valid midi note number
  - [toMidi](https://github.com/danigb/tonal/tree/master/modules/midi#toMidi): get midi note number from a note
  - [fromMidi](https://github.com/danigb/tonal/tree/master/modules/midi#fromMidi): get note name from midi number
  - [fromMidiS](https://github.com/danigb/tonal/tree/master/modules/midi#fromMidiS): get note name from midi number using sharps when altered

#### [tonal-freq](https://github.com/danigb/tonal/tree/master/modules/freq) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-freq.svg)](https://www.npmjs.com/package/tonal-freq)
  - [toFreq](https://github.com/danigb/tonal/tree/master/modules/freq#toFreq): get frequency of a note name
  - [fromFreq](https://github.com/danigb/tonal/tree/master/modules/freq#fromFreq): get note name from frequency
  - [cents](https://github.com/danigb/tonal/tree/master/modules/freq#cents): get distance in cents between two notes or frequencies
  - [toEqualTemp](https://github.com/danigb/tonal/tree/master/modules/freq#totoEqualTemp): create a function to convert notes to frequencies using equal temperament
  - [fromEqualTemp](https://github.com/danigb/tonal/tree/master/modules/freq#fromEqualTemp): create a function to convert frequencies to notes using equal temperament

#### [tonal-transpose](https://github.com/danigb/tonal/tree/master/modules/transpose) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-transpose.svg)](https://www.npmjs.com/package/tonal-transpose)
 - [transpose](https://github.com/danigb/tonal/tree/master/modules/transpose#transpose): transpose notes by intervals. Can be used to add intervals.
 - [trFifths](https://github.com/danigb/tonal/tree/master/modules/transpose#trFifths): transpose a note by a number of perfect fifths

#### [tonal-distance](https://github.com/danigb/tonal/tree/master/modules/distance) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
  - [distance](https://github.com/danigb/tonal/tree/master/modules/distance#distance): find the interval distance between two notes
  - [distInSemitones](https://github.com/danigb/tonal/tree/master/modules/distance#distInSemitones): get the distance between notes measured in semitones

#### [tonal-array](https://github.com/danigb/tonal/tree/master/modules/array) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-array.svg)](https://www.npmjs.com/package/tonal-array)
  - [asArr](https://github.com/danigb/tonal/tree/master/modules/array#asArr): split a strings into arrays
  - [map](https://github.com/danigb/tonal/tree/master/modules/array#map): map a function to a list
  - [filter](https://github.com/danigb/tonal/tree/master/modules/array#filter): filter a list using a function
  - [harmonizer](https://github.com/danigb/tonal/tree/master/modules/array#harmonizer): return a function that harmonizes notes using a list of intervals
  - [harmonize](https://github.com/danigb/tonal/tree/master/modules/array#harmonize): given a note and a list of intervals, harmonize the note with the intervals
  - [harmonics](https://github.com/danigb/tonal/tree/master/modules/array#harmonics): Given a list of notes, return the intervals from the first note to the rest.
  - [rotate](https://github.com/danigb/tonal/tree/master/modules/array#rotate): rotate a list
  - [rotateAsc](https://github.com/danigb/tonal/tree/master/modules/array#rotateAsc): rotate an list of ascending pitches keeping the asceding property after rotation
  - [select](https://github.com/danigb/tonal/tree/master/modules/array#select): select some elements from a list
  - [sort](https://github.com/danigb/tonal/tree/master/modules/array#sort): sort a list of notes or intervals
  - [shuffle](https://github.com/danigb/tonal/tree/master/modules/array#shuffle): shuffle an array


#### [tonal-filter](https://github.com/danigb/tonal/tree/master/modules/filter) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-filter.svg)](https://www.npmjs.com/package/tonal-filter)
- [scaleFilter](https://github.com/danigb/tonal/tree/master/modules/filter#scaleFilter): filter notes by a scale

#### [tonal-range](https://github.com/danigb/tonal/tree/master/modules/range) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-range.svg)](https://www.npmjs.com/package/tonal-range)
- [range](https://github.com/danigb/tonal/tree/master/modules/range#range): create a range of notes
- [scaleRange](https://github.com/danigb/tonal/tree/master/modules/range#sscaleRange): create a range using a scale
- [chromatic](https://github.com/danigb/tonal/tree/master/modules/range#chromatic): create a chromatic range
- [cycleOfFifths](https://github.com/danigb/tonal/tree/master/modules/range#cycleOfFifths): create a cycle of fifths range

### Modules not included in `tonal` package

To use them, this modules need to be installed and required explicitly. For example: `npm i --save tonal-scale` and `var scale = require('tonal-scale')`

#### [tonal-scale](https://github.com/danigb/tonal/tree/master/modules/scale) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-scale.svg)](https://www.npmjs.com/package/tonal-scale)

- [get](https://github.com/danigb/tonal/tree/master/modules/scale#get): get a scale from name
- [build](https://github.com/danigb/tonal/tree/master/modules/scale#build): build a scale from type or intervals and tonic
- [names](https://github.com/danigb/tonal/tree/master/modules/scale#names): get a list of all scale names

#### [tonal-chord](https://github.com/danigb/tonal/tree/master/modules/chord) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)
- [get](https://github.com/danigb/tonal/tree/master/modules/chord#get): get a chord from name
- [build](https://github.com/danigb/tonal/tree/master/modules/chord#build): build a chord from type or intervals and tonic
- [names](https://github.com/danigb/tonal/tree/master/modules/chord#names): get a list of all chord names


#### [tonal-key](https://github.com/danigb/tonal/tree/master/modules/key) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-key.svg)](https://www.npmjs.com/package/tonal-key)

- [scale](https://github.com/danigb/tonal/tree/master/modules/key#scale): Get the scale of a given key
- [relative](https://github.com/danigb/tonal/tree/master/modules/key#relative): Given a key in one mode, find it's relative in other.
- [names](https://github.com/danigb/tonal/tree/master/modules/key#names): Get a list of mode names.
- [isKeyMode](https://github.com/danigb/tonal/tree/master/modules/key#isKeyMode): test if a string is a valid key mode
- [build](https://github.com/danigb/tonal/tree/master/modules/key#build): build a key from mode and tonic
- [fromAlter](https://github.com/danigb/tonal/tree/master/modules/key#fromAlter): create a key from alteration
- [fromAcc](https://github.com/danigb/tonal/tree/master/modules/key#fromAcc): create a key from accidentals
- [fromName](https://github.com/danigb/tonal/tree/master/modules/key#fromName): create a key from name
- [asKey](https://github.com/danigb/tonal/tree/master/modules/key#asKey): try to interpret the object as a key
- [alteration](https://github.com/danigb/tonal/tree/master/modules/key#alteration): get key alteration
- [accidentals](https://github.com/danigb/tonal/tree/master/modules/key#accidentals): get key accidentals
- [alteredNotes](https://github.com/danigb/tonal/tree/master/modules/key#alteredNotes): get the altered notes of a key

#### [tonal-progression](https://github.com/danigb/tonal/tree/master/modules/progression) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-progression.svg)](https://www.npmjs.com/package/tonal-progression)

- [build](https://github.com/danigb/tonal/tree/master/modules/progression#build): build a progression from a list of chords (in roman numerals) and a tonic
- [romanRegex](https://github.com/danigb/tonal/tree/master/modules/progression#romanRegex): get a regex to match roman numerals.
- [parseRomanChord](https://github.com/danigb/tonal/tree/master/modules/progression#parseRomanChord): parse chord expressed with roman numerals.

## Build, test and documentation

To build or test this library you first you need is to clone this repository. Then, since it's a multimodule package if you run `npm test` you only run test for the `tonal` package (the facade). To run the test of all the modules you can run: `npm run modules-install && npm run modules-test`.

Or if you prefer `npm run test-ci` to run all in one command.

The API Reference documentation is generated with `jsdoc2md` package (not included in dependencies) and then the output copied to the README of each package.

The distributable `tonal-min.js` file is generated with `npm run dist`

## Inspiration

This library takes inspiration from other music theory libraries:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html
- Sharp11: https://github.com/jsrmath/sharp11

## License

MIT License
