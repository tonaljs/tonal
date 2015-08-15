# tonal

[![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal)

Tonal is a modular, functional (but currently __experimental__) music theory library. It provides lot of functions to create and manipulate musical entities:

```js
var transpose = require('tonal/interval/transpose')
transpose('M2', 'f#4') // => 'G#4'
var fromMidi = require('tonal/note/from-midi')
fromMidi(69) // => 'A4'
```

This library grows with some ideas in mind:
- String representations are first class citizens. Notes are 'C#2', intervals 'P5', scales: ['P1', 'P5'], key signatures: '###' and so on.
- Modular: get what you need. Require the desired functions, no more.
- Functional: all is data-in data-out, no classes, no side effects, no mutations.
- Provide lot of functions (the swiss army knife)
- Well tested
- Documented

This scope of this library is music theory objects: generation and analysis of music pieces. This is __not__ for _real_ music or sound synthesis although it can be used to create it ;-)

__This is alpha software__, if you need a stable music theory library in javascript you can use the excellent [teoria](https://github.com/saebekassebil/teoria)

## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

The more I code music entities, the more I understand the relations between them.

Also, I want a complete library, where I can model all what I learn, with some (for me) esoteric features like interval classes, binary scales and other weird stuff.


## What

The library is divided in a number of modules

### Notes

Notes is the basic building block of tonal. A note is represented with a string: `C`, `D#`, `F#8` are valid notes. A note always has three parts:
- step: a uppercase letter between A and code
- accidentals: a string representing the note accidentals: `##`, `bb`
- octave: a integer representing the octave (always present, 4 by default)

The note module has some functions to query and manipulate notes:

Complete module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/note.md)

### Intervals

An interval is also represented with a string. This are valid intervals:  `P5`, `m2`, `M-3`. The intervals has three parts:
- quality: a letter representing the interval quality (`d` is dimished, `m` is minor, `P` is perfect, `M` is major and `A` is augmented)
- direction: number 1 or -1 repesenting ascending or descending intervals respectively
- number: the interval's diatonic number. A positive or negative integer. Can't be 0

The interval module has functions to query and manipulate intervals:


Complete interval module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/interval.md)

### Scales

Complete scale module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/scale.md)

### Chords

Complete chord module documentation is [chords](https://github.com/danigb/tonal/blob/master/docs/chord.md)

### Set

A set is a group of intervals or notes. In tonal is represented as an array and is the basic building block of scales and chords.

- [set](https://github.com/danigb/tonal/blob/master/docs/set.md): working with list of intervals or notes

### Key

Key signature related functions

Complete key module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/key.md)

### Misc

Yet uncategorized functions. Currently is a bag of utilities.

Complete misc module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/misc.md)

## Usage

The idea is that you only require the functions you need:

```js
var transpose = require('tonal/note/transpose')
tranpose('P5', 'C')
```

Currently there's no way to load the entire library in one require.

## Documentation and tests

The functions are documented inside the code. The generated documentation can be read [here](https://github.com/danigb/tonal/blob/master/documentation.md)

To run the tests, clone this repository and run:

```bash
npm install
npm test
```

## Resources and inspiration

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale code is inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Interval analisys is based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

A Corpus Study of Rock Music:  http://theory.esm.rochester.edu/rock_corpus/index.html
Musical futures: https://www.musicalfutures.org/

Music JSON proposal: https://github.com/soundio/music-json

## License

MIT License
