# tonal

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal)
[![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://img.shields.io/npm/v/tonal.svg)](https://www.npmjs.com/package/tonal)
[![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)
[![tonal](https://img.shields.io/badge/tonal-lib-yellow.svg)](https://www.npmjs.com/package/tonal)

Tonal is a collection of libraries to create and manipulate tonal elements of music (pitches, chords, scales and keys). It deals with abstractions (not actual music) and while is designed for algorithmic composition and music generation, can be used to develop any kind of midi or audio software:

```js
var tonal = require('tonal/pitch')

// notes and intervals
tonal.note.fromMidi(60) // => 'C4'
tonal.note.midi('A4') // => 69
tonal.note.fromFreq(220) // => 'A3'
tonal.note.freq('C') // => ...

// transposition and distances
tonal.tranpose('D4', '2M') // => 'E#4'
tonal.distance('C', 'G') // => '5P'
['c', 'd', 'e'].map(tonal.transpose('3M')) // => ['E4', 'F#4', 'G#4']

// harmonizers
var major = tonal.harmonizer(['1P', '3M', '5M'])
major('C6') // => ['C6', 'E6', 'G6']
major('E5', true) /// => ['E', 'G#', 'B'] (only pitch classes)
var V7 = tonal.harmonizer(['1P', '3M', '5M', '7m'])
var V7ofV = function(pitch) { V7(tonal(pitch, '5P')) }
var V7ofV('D') // => ['A4', 'C#5', 'E5', 'G7']
```

## Features

- Note, intervals, transposition, distances, enharmonics
- Midi and frequency conversion
- Scales, chords, dictionaries
- Work with collection of notes: gamut, harmonizer
- Pitch sets and binary representations
- Keys, keys signatures, key scales and chords, key detection

## Philosophy

- Functional: no classes, no side effects, no mutations. Just functions, data-in data-out. Most of the functions has the data to operate on as last argument and lot of functions are currified.
- Heavy use of string representations: 'C#2' is a pitch, '3M' is an interval. No objects.
- Small and fast
- Modular: each functionallity has its own module (all integrated in tonal). You can require exactly the functions you need.
- Different notations: scientific notation by default. Use other easily.
- Documented: all public functions are documented inside the code. Aside the generated documentation (in API.md file) a 'how to' guides are provided for each module.
- Learneable: since all the modules share the same philosophy is easy to work with them.
- Tested: carefully tested with coverage support. Codeclimate statistics.
- Advanced features: chord and scale detection, binary sets, chord progressions, key signatures...

## What

The library is divided in a number of modules:


## Usage

Install via npm: `npm i --save tonal`

Then you can load the whole library:

```js
var tonal = require('tonal')
tonal.pitch.transpose(tonal.note.fromMidi(60), '2M')
```

... one module (you have to install it first):

```js
var pitch = require('tonal.note')
note.transpose(pitch.fromMidi(60), '2M')
```

or a function:

```js
var signature = require('tonal.key/signature')
signature('A major') // => '###'
```

## Documentation and tests

The functions are extensively documented inside the code. The generated documentation can be read [here]()

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

While developing, I read/study part of this resources:

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale stuff (like scale spaces) are inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Trying to get the correct name of the things:
http://music.stackexchange.com/questions/17780/naming-pitch-and-interval-collections

Interval analysis stuff are based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

Other things this library can be related to:
A Corpus Study of Rock Music:  http://theory.esm.rochester.edu/rock_corpus/index.html
Musical futures: https://www.musicalfutures.org/
Music JSON proposal: https://github.com/soundio/music-json
Staff notation: http://opusmodus.com/omn.html

## License

MIT License
