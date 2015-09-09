# tonal

[![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Tonal is a modular, functional (but currently __experimental__) music theory library. It provides functions to create and manipulate musical entities:

```js
var transpose = require('tonal/note/transpose')
transpose('M2', 'f#4') // => 'G#4'
['E', 'F'].map(transpose('M2')) // => ['F#4', 'G4']
['M2', 'm3'].map(transpose('C')) // => ['D4', 'Eb4']

var scale = require('tonal/scale/scale')
scale('A major') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
scale('A major').map(transpose('P8')) // => ['A5, 'B5', ...]
```

Since you only require the methods needed (_a-la-lodash_) the dependencies are reduced to the minimum. You can think each function in tonal like a npm micro-module.

This library is growing with this ideas in mind:
- String representations are first class citizens. Notes are 'C#2', 'Db4'..., intervals 'P5', 'm2', 'M-7'..., scales are 'C major', 'D harmonic minor'..., chords are 'Cmaj7', 'Bb79', interval lists are 'P1 M2 P5', 'P1 M-3'..., a valid note lists is 'C D E', and key signatures are defined with (for example) '###'
- Modular: get what you need. Require the desired functions, no more.
- Functional: all is data-in data-out, no classes, no side effects, no mutations.
- Provide lot of functions (the swiss army knife)
- Well tested
- Documented

This scope of this library is music theory objects: generation and analysis of music pieces. This is __not__ for _real_ music or sound synthesis although it can be used to create it ;-)

__This is alpha software__, if you need a stable music theory library in javascript you can use the excellent [teoria](https://github.com/saebekassebil/teoria)

## Why

Mostly, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

Also, I want a complete library, where I can model all what I learn, with some (for me) esoteric features like interval classes, binary scales and other weird stuff.

## What

The library is divided in a number of modules:

- [Pitch](https://github.com/danigb/tonal/blob/master/docs/pitch.md)
- [Interval](https://github.com/danigb/tonal/blob/master/docs/interval.md)
- [Harmonizer](https://github.com/danigb/tonal/blob/master/docs/scale.md)
- [Misc](https://github.com/danigb/tonal/blob/master/docs/misc.md)

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
// Create notes:
pitch('a4') // => { name: 'a4', pitchClass: 'A', midi: 69 ... }
fromKey(28) // =>

// Create intervals:
distance('A4', 'G7') // => 'm7'
transpose('A4', 'M6') // => 'F#5'
invert(distance('a4', 'bb5')) // => 'M7'

// Scales:
var mixolidian = scale('mixolidian')
mixolidian('a4') // => ['A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G5']
scale('aeolian')('a4') // => ['A4', 'B4', 'C5', ...]
scale('ionian')('g5') // => ['G5', 'A5', ...]
scale('diminished whole tone')('C#4')

// Chords:
var sus2 = chord('sus2')
sus2('A4') // => [ 'A4', 'B4', 'E5' ]
chord('M69#11')('Bb') // => [ 'Bb4', 'D5', 'F5', 'G5', 'C5', 'E5' ]

// Tonal doesn't allow crazy chaining:
var lidian = scale('lidian')
var note = get('thirth', lidian('A4').map(transpose.by('M2')))
chord('maj9')(note)
```

Examples ported from MusikKit:

```js
var V7ofV = function(pitch) { chord('7', transpose(pitch, 'P5')) }
V7ofV('D') // => ['A4', 'C#5', 'E5', 'G5']
```

## Documentation and tests

The functions are documented inside the code. The generated documentation can be read [here](https://github.com/danigb/tonal/blob/master/docs)

To run the tests, clone this repository and run:

```bash
npm install
npm test
```

## Resources and inspiration

This library takes inspiration from lot of places. Music libraries:
- https://github.com/saebekassebil/teoria
- https://github.com/benzguo/MusicKit

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale code is inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Interval analisys is based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

A Corpus Study of Rock Music:  http://theory.esm.rochester.edu/rock_corpus/index.html
Musical futures: https://www.musicalfutures.org/

Music JSON proposal: https://github.com/soundio/music-json

## License

MIT License
