# tonal

[![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Tonal is a library to create and manipulate tonal elements of music (pitches, chords, scales and keys). It deals with abstractions (not actual music) and it is a library for composing, transforming or analyse music:

```js
// pitch and interval manipulation
var pitch = require('tonal/pitch/pitch')
pitch('C#4') // => { name: 'C#4', pitchClass: 'C#', oct: '4', ... }

var transpose = require('tonal/note/transpose')
transpose('M2', 'f#4') // => 'G#4'

// functional programming
var sequence = require('tonal/sequence/sequence')
sequence('A B C D E').map(transpose('M2')) // => ['B4', 'C#5', 'D5', 'E5', 'F#5']

// scales and chords
var scale = require('tonal/scale/scale')
scale('A major') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
scale('A major').map(transpose('P8')) // => ['A5, 'B5', ...]

var scaleNames = require('tonal/scale/names')
scaleNames('C D E F G A B C') // => ['C major', 'C ionian']

var chord = require('tonal/chord/chord')
chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
```

Tonal has a number of characteristics that make it unique:

- It is __functional__: no classes, no side effects, no mutations, just data and functions.
- Heavy use of __strings to represent entities__: pitches (`'C#2'`, `'Bb'`, `'G##'`), intevals (`'M2'`, `'m-9'`), chords (`'Cmaj7'`, `'Bb79'`), scales (`'C major'`, `'Bb bebop'`), sequences (`'C D E F'`, `'P1 M2 M3'`, `'Cmaj7 Dm9'`), keys (`'C major'`, `'Bb minor'`, `'###'`)
- Extremely __modular__: require the functions not the library (_a-la-lodash_) so the dependencies are reduced to the minimum. You can think each function in tonal like a npm micro-module.
- Advanced features: binary scales, chord and scale detection, ...

## Why

Mostly, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

## What

The library is divided in a number of modules:

- [Pitches](https://github.com/danigb/tonal/blob/master/docs/pitch.md)
- [Intervals](https://github.com/danigb/tonal/blob/master/docs/interval.md)
- [Chords](https://github.com/danigb/tonal/blob/master/docs/chord.md)
- [Scales](https://github.com/danigb/tonal/blob/master/docs/scale.md)
- [Sequences](https://github.com/danigb/tonal/blob/master/docs/sequence.md)
- [Binary Scales](https://github.com/danigb/tonal/blob/master/docs/binary-scale.md)

Take a look to [the source](https://github.com/danigb/tonal/blob/master/lib) or the [documentation](https://github.com/danigb/tonal/tree/master/docs)

## Usage

Install via npm: `npm i --save tonal` and require the functions you need:

```js
var transpose = require('tonal/note/transpose')
tranpose('P5', 'C')
```

Currently there's no way to load the entire library in one require.

## Examples

This are the examples from teoria ported to `tonal`:

```js
// Create pitches
pitch('a4') // => { name: 'a4', pitchClass: 'A', midi: 69 ... }
fromMidi(60) // => 'C4'
fromKey(28) // =>

// Create notes from intervals
distance('A4', 'G7') // => 'm7'
transpose('A4', 'M6') // => 'F#5'
invert(distance('a4', 'bb5')) // => 'M7'

// Scales
scale('A aeolian') // => ['A4', 'B4', 'C5', ...]
scale('g5 ionian') // => ['G5', 'A5', ...]
scale('mixolydian') // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7']

// Chords
chord('Asus4') // => [ 'A4', 'B4', 'E5' ]
chord('BbM69#11') // => [ 'Bb4', 'D5', 'F5', 'G5', 'C5', 'E5' ]

// Tonal doesn't allow crazy chaining:
var note = get('thirth', scale('A4 lidian').map(transpose.by('M2')))
chord('maj9')(note)
```

Examples ported from MusikKit:

```js
var V7ofV = function(pitch) { chord(transpose(pitch, 'P5'), '7') }
V7ofV('D') // => ['A4', 'C#5', 'E5', 'G5']
```

## Documentation and tests

The functions are extensively documented inside the code. The documentation can be read [here](https://github.com/danigb/tonal/blob/master/docs)

To run the tests, clone this repository and run:

```bash
npm install
npm test
```

## Resources and inspiration

This library takes inspiration from lot of places:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale stuff (like scale spaces) are inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Interval analisys is based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

A Corpus Study of Rock Music:  http://theory.esm.rochester.edu/rock_corpus/index.html
Musical futures: https://www.musicalfutures.org/

Music JSON proposal: https://github.com/soundio/music-json

Staff notation: http://opusmodus.com/omn.html

## License

MIT License
