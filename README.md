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

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

The more I code music entities, the more I understand the relations between them.

Also, I want a complete library, where I can model all what I learn, with some (for me) esoteric features like interval classes, binary scales and other weird stuff.

## What

The library is divided in a number of modules:

### Notes

Notes is the basic building block of tonal. A note is represented with a string: `C`, `D#`, `F#8` are valid notes. A note always have three parts:
- step: a uppercase letter between A and code
- accidentals: a string representing the note accidentals: `##`, `bb`
- octave: a integer representing the octave (if note present, 4 by default)

The note module has some functions to query and manipulate notes. Here are some examples:

```js
var parse = require('tonal/note/parse')
parse('cx') // => { note: 'cx', step: 'C', acc: '##', oct: 4 }
var freq = require('tonal/note/freq')
freq('A4') // => 440
```

Complete module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/note.md)

### Intervals

Intervals are the next building block. The main purpose of this module is calculate transpositions and distances:

```js
var parse = require('tonal/interval/parse')
parse('m-2') // => { q: 'm', d: -1, n: 2 }
var transpose = require('tonal/interval/transpose-interval')
transpose('M2', 'C') // => 'D4'
var distance = require('tonal/interval/distance-interval')
distance('C', 'G') // => 'P5'
```

In tonal, an interval is also represented with a string. These are valid intervals:  `P5`, `m2`, `M-3`. The intervals has three parts:
- quality: a letter representing the interval quality (`d` is dimished, `m` is minor, `P` is perfect, `M` is major and `A` is augmented)
- direction: number 1 or -1 for ascending or descending intervals respectively
- number: the interval's [diatonic number](https://en.wikipedia.org/wiki/Interval_(music)#Number). A positive or negative integer. Can't be 0.

The interval module has functions to query and manipulate intervals. Here are some examples:

Complete interval module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/interval.md)

### Lists

A list is a group of intervals or notes, and they are the building blocks of scales and chords. They can be constructed using a space separated string list or with an array. They have some constrains:
- All items MUST be same type: a list or notes or intervals, but no both
- If its a list of intervals, the first one MUST be P1

```js
var list = require('tonal/list/list')
list('P1 P5 M6', 'C') // => 'C4 G4 A4'
list(['P1', 'M2'], 'C') // => 'C4 D4'
list('C D') // => ['P1', 'M2']
list('C D', 'E') // => ['E4', 'F#4']
var intervals = require('tonal/list/intervals')
intervals(['C', 'G']) // => ['P1', 'P5']
```

A list can also be constructed with a binary string or its decimal equivalent:

```js
list('101') // => ['P1', 'M2']
list('101', 'C') // => ['C4', 'D4']
list(2773, 'C') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
```

For a complete module documentation look [here](https://github.com/danigb/tonal/blob/master/docs/list.md)

### Scales

Basically it contains different .json dictionaries to generate scales from scale names. By default `tonal/scale/scale` load all the scales. You can reduce the size of the code choosing a lighter dictionary.

Complete scale module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/scale.md)

### Chords

Complete chord module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/chord.md)

### Misc

Yet uncategorized functions.

Complete misc module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/misc.md)


## Incubator modules

### Score

This has functions to parse and manipulate music events (notes, chords or whatever with position and duration).

Complete score module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/score.md)

### Time

A module with functions to work with time values. You can parse time meters (time signature), or work with note durations.

A complete duration module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/duration.md)


### Key

Key signature related functions

Complete key module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/key.md)

## Usage

Install via npm: `npm i --save tonal` and require the functions you need:

```js
var transpose = require('tonal/note/transpose')
tranpose('P5', 'C')
```

Currently there's no way to load the entire library in one require.

If you need browser support you can use browserify, webpack o webmake. If using webpack, you need json support in order to use scales or chords.

## Documentation and tests

The functions are documented inside the code. The generated documentation can be read [here](https://github.com/danigb/tonal/blob/master/docs)

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
