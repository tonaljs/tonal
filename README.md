# tonal [![npm](https://img.shields.io/npm/v/tonal.svg)](https://www.npmjs.com/package/tonal) [![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal) [![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)

`tonal` is a modular, functional music theory library. Built from a collection of modules, it's able to create and manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music) and while is designed for algorithmic composition and music generation, can be used to develop any kind of midi or audio software.

Although this library is under active development, the modules more than 1.0.0 are considered __more or less__ stable.

## Example

```js
var tonal = require('tonal')

// notes and intervals
tonal.note.fromMidi(60) // => 'C4'
tonal.note.midi('A4') // => 69
tonal.note.fromFreq(220) // => 'A3'
tonal.note.freq('C2') // => 65.40639132514966

// transposition and distances
tonal.tranpose('D4', '2M') // => 'E#4'
tonal.distance('C', 'G') // => '5P'
['c', 'd', 'e'].map(tonal.transpose('3M')) // => ['E4', 'F#4', 'G#4']

// scales and chords
tonal.scale('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
tonal.chord('Cmaj7') // => ['C', 'E', 'G', 'B']

// harmonizers
var major = tonal.harmonizer('1 3 5')
major('C#') // => ['C#', 'E#', 'G#']
major('E5') /// => ['E5', 'G#5', 'B5']
var V7 = tonal.harmonizer('1 3 5 7m')
var V7ofV = function(tonic) { V7(tonal.transpose(tonic, '5P')) }
var V7ofV('D') // => ['A4', 'C#5', 'E5', 'G7']

// keys
key('###') // => 'A major'
key.signature('A major') // => '###'
key.altNotes('A major') // => ['F#', 'C#']
key.relative('minor', 'A major') // => 'F minor'
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

- Notes and intervals are represented with strings, instead of objects. Easy and concise code.
- Functional: no classes, no side effects, no mutations. Just functions, data-in data-out. Most of the functions has the data to operate on as last argument and lot of functions are currified.
- [Small](https://rawgit.com/danigb/tonal/master/dist/disc.html) and fast
- Modular: [lot of modules](https://www.npmjs.com/browse/keyword/tonal) (all integrated in tonal). You can require exactly the functions you need, or get the [whole thing](https://www.npmjs.com/package/tonal).
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

## How to...

This is a detailed how to of what can be done with tonal.

`tonal` is a collection of modules. They all live in this
multi package repository ([monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)). Take a look inside [`packages`](https://github.com/danigb/tonal/tree/master/packages). The object from `tonal` package is a facade with access to all the modules, perfect if you are not concern with javascript size (currently about 30kb minified)

The code examples shows both requiring each package or using the tonal facade. To use the tonal facade you must require `tonal` library:

```js
var tonal = require('tonal')
```

### Work with notes and midi

Notes in `tonal` are just strings with notes in scientific notation. Midi numbers are integers from 0 to 127.


[![note-midi](https://img.shields.io/badge/tonal-note--midi-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/note-midi)
[![npm](https://img.shields.io/npm/v/note-midi.svg)](https://www.npmjs.com/package/note-midi)

__How to get midi number from note name?__

```js
var midi = require('note-midi')
midi('A4') // => 69
// or
tonal.note.midi('c2') // => 36
```

__How to get note name from midi number?__

```js
var note = require('midi-note')
note(69) // => 'A4'
// or
tonal.midi.note(36) // => 'C2'
```

[![note-freq](https://img.shields.io/badge/tonal-note--freq-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/note-freq)
[![npm](https://img.shields.io/npm/v/note-freq.svg)](https://www.npmjs.com/package/note-freq)

__How to get frequency from a note name or midi number?__

```js
var freq = require('note-freq')
freq(440, 'A3') // => 220
freq(440, 69) // => 440
// or partially applied
var standard = freq(440)
standard('A2') // => 110
// or
tonal.note.freq(440, 'C2')
```

[![enharmonics](https://img.shields.io/badge/tonal-enharmonics-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/enharmonics)
[![npm](https://img.shields.io/npm/v/enharmonics.svg)](https://www.npmjs.com/package/enharmonics)

__How to get note enharmonics?__

```js
var enharmonics = require('enharmonics')
enharmonics('B#') // => [ 'A###', 'B#', 'C' ]
// or
tonal.enharmonics('B#')
```

__How to simplify note name?__

Select the less altered note from it's enharmonics:

```js
enharmonics.simplify('B#3') // => 'C4'
// or
tonal.enharmonics.simplify('B#3') // => 'C4'
```

[![pitch-class](https://img.shields.io/badge/tonal-pitch--class-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/pitch-class)
[![npm](https://img.shields.io/npm/v/pitch-class.svg)](https://www.npmjs.com/package/pitch-class)


__How to get pitch class of a note?__

```js
var pc = require('pitch-class')
pc('c#2') // => 'C#'
// or
tonal.pitchClass(57) // => A (yes, it works with midi too)
```

### Transpose notes

[![note-transposer](https://img.shields.io/badge/tonal-note--transposer-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/note-transposer)
[![npm](https://img.shields.io/npm/v/note-transposer.svg)](https://www.npmjs.com/package/note-transposer)

__How to transpose a note by an interval?__

```js
var transpose = require('note-transposer')
transpose('C3', '3m') // => 'Eb3'
// create a transposer
var major3th = transpose('3M')
['C', 'D', 'E'].map(major3th) // => ['E', 'F#', 'G#']
// using tonal
tonal.transpose('C3', '3m') // => 'Eb3'
```

[![note-harmonizer](https://img.shields.io/badge/tonal-note--harmonizer-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/note-harmonizer)
[![npm](https://img.shields.io/npm/v/note-harmonizer.svg)](https://www.npmjs.com/package/note-harmonizer)

__How to harmonize a note from an interval list?__

```js
var harmonize = require('note-harmonizer')

// harmonize a note
harmonize('P1 M3 P5', 'G2') // => ['G2', 'B2', 'D3']
// create an harmonizer
var maj7Chord = harmonize('1 3 5 7')
var maj7Chord('A4') // => ['A4', 'C#5', 'E5', 'G#5']
// or
tonal.harmonize('1 3 5', 'G2') // => ['G2', 'B2', 'D3']
```

### Work with intervals

[![note-interval](https://img.shields.io/badge/tonal-note--interval-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/note-interval)
[![npm](https://img.shields.io/npm/v/note-interval.svg)](https://www.npmjs.com/package/note-interval)

__How to find the interval between two notes?__

```js
var interval = require('note-interval')
interval('C4', 'E4') // => '3M'
interval('D2', 'C2') // => '-2M'
// partially applied
var fromC = interval('C')
fromC('D') // => '2M'
// or
tonal.note.interval('C3', 'G#3') // => 'A5'
```


[![semitones](https://img.shields.io/badge/tonal-semitones-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/semitones)
[![npm](https://img.shields.io/npm/v/semitones.svg)](https://www.npmjs.com/package/semitones)

__How to get the size in semitones of an interval?__

```js
var semitones = require('semitones')
semitones('P4') // => 5
['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(semitones)
// => [ 0, 2, 4, 5, 7, 9, 11, 12 ]
// or
tonal.semitones('P4') // => 5
```

__How to know if an interval is ascending or descending?__

```js
return semitones('M3') < 0 ? 'descending' : 'ascending'
```

[![interval-simplify](https://img.shields.io/badge/tonal-interval--simpl-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/interval-simplify)
[![npm](https://img.shields.io/npm/v/interval-simplify.svg)](https://www.npmjs.com/package/interval-simplify)

__How to simplify an interval?__

```js
var simplify = require('interval-simplify')
simplify('9M') // => '2M'
// or
tonal.interval.simplify('8P') // => '8P'
```

__How to know if an interval is simple or compound?__

```js
simplify(interval) === interval ? 'simple' : 'compound'
```

[![interval-invert](https://img.shields.io/badge/tonal-invert--interval-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/interval-invert)
[![npm](https://img.shields.io/npm/v/interval-invert.svg)](https://www.npmjs.com/package/interval-invert)

__How to invert an interval?__

```js
var invert = require('interval-invert')
invert('2M') // => '7m'
// or
tonal.interval.invert('3m') // => '6M'
```

[![interval-class](https://img.shields.io/badge/tonal-interval--class-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/interval-class)
[![npm](https://img.shields.io/npm/v/interval-class.svg)](https://www.npmjs.com/package/interval-class)

__How to get the interval class of an interval?__

```js
var ic = require('interval-class')
ic('P4') // => 5
['1P', '2M', '3M', '4P', '5P', '6M', '7M'].map(ic)
// => [ 0, 2, 4, 5, 5, 3, 1, 0 ]
// using semitones
ic(7) // => 5 (a perfect fifth)
// or
tonal.ic(7) // => 5 (a perfect fifth)
```

### Work with scales and chords

[![music-scale](https://img.shields.io/badge/tonal-music--scale-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/music-scale)
[![npm](https://img.shields.io/npm/v/music-scale.svg)](https://www.npmjs.com/package/music-scale)

__How to create a scale from a scale name?__

```js
var scale = require('music-scale')
// get scale from name
scale('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
// or
tonal.scale('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
```

__How to create a scale from name and tonic?__

```js
tonal.scale('major', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
// partially applied
var major = tonal.scale('major')
major('A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
```

__How to create a scale from intervals and tonic?__

```js
tonal.scale('1 2 3 4 5 6 7', 'A') // => ['A', 'B', 'C#' 'D', 'E', 'F#', 'G#']
tonal.scale('1 2 3 4 5 6 7', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
```

[![music-chord](https://img.shields.io/badge/tonal-music--chord-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/music-chord)
[![npm](https://img.shields.io/npm/v/music-chord.svg)](https://www.npmjs.com/package/music-chord)

__How to create a chord from a chord name?__

```js
var chord = require('music-chord')
chord('Cmaj7') // => ['C', 'E', 'G', 'B']
// or
tonal.chord('Cmaj7') // => ['C', 'E', 'G', 'B']
```

__How to create a chord from name and tonic?__

```js
tonal.chord('maj7', 'A') // => ['A', 'C#', 'E', 'G#']
// partially applied
var maj7 = tonal.chord('maj7')
var maj7('A4') // => ['A4', 'C#5', 'E5', 'G#5']
```

__How to create a chord from intervals and tonic?__

```js
tonal.chord('1 3 5 7', 'A4') // => ['A4', 'C#5', 'E5', 'G#5']
```

### Work with collection of notes

[![pitch-sort](https://img.shields.io/badge/tonal-pitch--sort-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/pitch-sort)
[![npm](https://img.shields.io/npm/v/pitch-sort.svg)](https://www.npmjs.com/package/pitch-sort)

__How to sort a collection of notes?__

```js
var sort = require('pitch-sort')
sort(true, 'c2 d5 f0 gb g#2 db-1 c# ab2 h6 b3') // true means ascending
// => [null, 'C#', 'Gb', 'Db-1', 'F0', 'C2', 'G#2', 'Ab2', 'B3', 'D5']
// or use tonal.sort, tonal.sortAsc and tonal.sortDesc:
tonal.sortAsc('A G F C E') // => ['C', 'E', 'F', 'G', 'A']
```


## List of packages

#### Notation
- [music-notation](https://github.com/danigb/tonal/tree/master/packages/music-notation):
Parse notes, intervals, scale names, alterations...
[![npm](https://img.shields.io/npm/v/music-notation.svg)](https://www.npmjs.com/package/music-notation)

#### Notes and intervals
- [note-midi](https://github.com/danigb/tonal/tree/master/packages/note-midi):
Note name to midi
[![npm](https://img.shields.io/npm/v/note-midi.svg)](https://www.npmjs.com/package/note-midi)
- [midi-note](https://github.com/danigb/tonal/tree/master/packages/midi-note):
Midi to note name
[![npm](https://img.shields.io/npm/v/midi-note.svg)](https://www.npmjs.com/package/midi-note)
- [midi-freq](https://github.com/danigb/tonal/tree/master/packages/midi-freq):
Given a midi note, get it's frequency
[![npm](https://img.shields.io/npm/v/midi-freq.svg)](https://www.npmjs.com/package/midi-freq)
- [enharmonics](https://github.com/danigb/tonal/tree/master/packages/enharmonics):
Get note enharmonics
[![npm](https://img.shields.io/npm/v/enharmonics.svg)](https://www.npmjs.com/package/enharmonics)
- [semitones](https://github.com/danigb/tonal/tree/master/packages/semitones):
Get the size in semitones of an interval
[![npm](https://img.shields.io/npm/v/semitones.svg)](https://www.npmjs.com/package/semitones)
- [interval-class](https://github.com/danigb/tonal/tree/master/packages/interval-class):
Get the interval-class of an interval
[![npm](https://img.shields.io/npm/v/interval-class.svg)](https://www.npmjs.com/package/interval-class)


#### Transposition and distances
- [note-transposer](https://github.com/danigb/tonal/tree/master/packages/note-transposer):
Transpose notes
[![npm](https://img.shields.io/npm/v/note-transposer.svg)](https://www.npmjs.com/package/note-transposer)
- [note-harmonizer](https://github.com/danigb/tonal/tree/master/packages/note-harmonizer):
Harmonize notes or create harmonizer functions
[![npm](https://img.shields.io/npm/v/note-harmonizer.svg)](https://www.npmjs.com/package/note-harmonizer)
- [note-interval](https://github.com/danigb/tonal/tree/master/packages/note-interval):
Find the interval between two notes
[![npm](https://img.shields.io/npm/v/note-interval.svg)](https://www.npmjs.com/package/note-interval)

#### Collection of notes
- [pitch-set](https://github.com/danigb/tonal/tree/master/packages/pitch-set):
Create pitch sets
[![npm](https://img.shields.io/npm/v/pitch-set.svg)](https://www.npmjs.com/package/pitch-set)
- [music-scale](https://github.com/danigb/tonal/tree/master/packages/music-scale):
Create music scales
[![npm](https://img.shields.io/npm/v/music-scale.svg)](https://www.npmjs.com/package/music-scale)
- [music-chord](https://github.com/danigb/tonal/tree/master/packages/music-chord):
Create music chords
[![npm](https://img.shields.io/npm/v/music-chord.svg)](https://www.npmjs.com/package/music-chord)
- [scale-dictionary](https://github.com/danigb/tonal/tree/master/packages/scale-dictionary):
A music scales dictionary
[![npm](https://img.shields.io/npm/v/scale-dictionary.svg)](https://www.npmjs.com/package/scale-dictionary)
- [chord-dictionary](https://github.com/danigb/tonal/tree/master/packages/chord-dictionary):
A music chords dictionary
[![npm](https://img.shields.io/npm/v/chord-dictionary.svg)](https://www.npmjs.com/package/chord-dictionary)
- [note-range](https://github.com/danigb/tonal/tree/master/packages/note-range):
Create ranges of notes
[![npm](https://img.shields.io/npm/v/note-range.svg)](https://www.npmjs.com/package/note-range)
- [music-gamut](https://github.com/danigb/tonal/tree/master/packages/music-gamut):
Work with collection of notes
[![npm](https://img.shields.io/npm/v/music-gamut.svg)](https://www.npmjs.com/package/music-gamut)
- [music-dictionary](https://github.com/danigb/tonal/tree/master/packages/music-dictionary):
Create dictionaries of notes
[![npm](https://img.shields.io/npm/v/music-dictionary.svg)](https://www.npmjs.com/package/mmusic-dictionary)
- [interval-density](https://github.com/danigb/tonal/tree/master/packages/interval-density):
Analyze the intervals of a collection of notes
[![npm](https://img.shields.io/npm/v/interval-density.svg)](https://www.npmjs.com/package/interval-density)

#### Keys
- [music-key](https://github.com/danigb/tonal/tree/master/packages/music-key):
Get key accidentals, relative major and minor, key notes and key alterations
[![npm](https://img.shields.io/npm/v/music-key.svg)](https://www.npmjs.com/package/music-key)

#### Work in progress...

- [scale-triads](https://github.com/danigb/tonal/tree/master/packages/scale-triads):
Create triads from scales
[![npm](https://img.shields.io/npm/v/scale-triads.svg)](https://www.npmjs.com/package/scale-triads)
- [note-filter](https://github.com/danigb/tonal/tree/master/packages/note-filter):
Filter notes
[![npm](https://img.shields.io/npm/v/note-filter.svg)](https://www.npmjs.com/package/note-filter)
- [binary-set](https://github.com/danigb/tonal/tree/master/packages/binary-set):
Binary pitch set manipulation
[![npm](https://img.shields.io/npm/v/binary-set.svg)](https://www.npmjs.com/package/binary-set)
- [chord-type](https://github.com/danigb/tonal/tree/master/packages/chord-type):
Get the type of a chord
[![npm](https://img.shields.io/npm/v/chord-type.svg)](https://www.npmjs.com/package/chord-type)
- [chord-progression](https://github.com/danigb/tonal/tree/master/packages/chord-progression):
Create chord progressions
[![npm](https://img.shields.io/npm/v/chord-progression.svg)](https://www.npmjs.com/package/chord-progression)


## Install

Install via npm: `npm i --save tonal`

Then you can load the whole library:

```js
var tonal = require('tonal')
tonal.transpose(tonal.note.fromMidi(60), '2M') // => 'D4'
```

... or install and require individual modules:

```js
var midiNote = require('midi-note')
var transpose = require('note-transposer')
transpose(midiNote(60), '2M') // => 'D4'
```

## Documentation and tests

The functions are extensively documented inside the code. The generated documentation can be read [here]()

To run the tests, clone this repository and run:

```bash
make
```

## Resources and inspiration

This library takes inspiration from lot of places:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html
- leipzig: https://github.com/ctford/leipzig

While developing, I read/study part of this resources:

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale stuff (like scale spaces) are inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Trying to get the correct name of the things:
http://music.stackexchange.com/questions/17780/naming-pitch-and-interval-collections

Interval analysis stuff are based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

Other things this library can be related to:

- A Corpus Study of Rock Music:  http://theory.esm.rochester.edu/rock_corpus/index.html
- Musical futures: https://www.musicalfutures.org/
- Music JSON proposal: https://github.com/soundio/music-json
- Staff notation: http://opusmodus.com/omn.html

## License

MIT License
