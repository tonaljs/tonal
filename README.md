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

Tonal itself is built from a collection of [modules](). Some of they are exposed in the `tonal` facade that can be installed via npm: `npm i tonal`. Some others must be required explicitly, like scales: `npm i tonal-scales`

### Modules included in `tonal` facade

#### [tonal-note]()
  - [noteName](): get the note name
  - [chroma]: get chroma of a note
  - [pc](): get pitch class of a note
  - [enharmonics](): get a list of note enharmonics
  - [simpleEnh](): get the simplest enharmonic of a note

#### [tonal-interval]()
  - [ivlName](): get the interval name
  - [semitones](): get the size of an interval in semitones
  - [fromSemitones](): create an interval from a semitones number
  - [ic](): get interval class
  - [itype](): get interval type
  - [invert](): invert interval
  - [simplify](): simplify interval

#### [tonal-midi]()
  - [isMidiNum](): test if the given number is a valid midi note number
  - [toMidi](): get midi note number from a note
  - [fromMidi](): get note name from midi number
  - [fromMidiS](): get note name from midi number using sharps when altered

#### [tonal-freq]()
  - [toFreq](): get frequency of a note name
  - [fromFreq](): get note name from frequency
  - [cents](): get distance in cents between two notes or frequencies
  - [toEqualTemp](): create a function to convert notes to frequencies using equal temperament
  - [fromEqualTemp](): create a function to convert frequencies to notes using equal temperament

#### [tonal-transpose]()
 - [transpose](): transpose notes by intervals. Can be used to add intervals.
 - [trFifths](): transpose a note by a number of perfect fifths

#### [tonal-distance]()
  - [distance](): find the interval distance between two notes

#### [tonal-array]()
  - [asArr](): split a strings into arrays
  - [map](): map a function to a list
  - [filter](): filter a list using a function
  - [harmonizer](): return a function that harmonizes notes using a list of intervals
  - [harmonize](): given a note and a list of intervals, harmonize the note with the intervals
  - [sort](): sort a list of notes or intervals
  - [shuffle](): shuffle an array

#### [tonal-range]()

- [range](): create a range of notes
- [scaleRange](): create a range using a scale
- [chromatic](): create a chromatic range
- [cycleOfFifths](): create a cycle of fifths range
- [fromPitchSet]: given a scale and a midi number, return a note name if the note correspond to the scale
- [noteRange]: create note ranges using a note name generator

## License

MIT License
